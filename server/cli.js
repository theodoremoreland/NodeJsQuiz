// Native library
import fs from "fs";

// Third party
import inquirer from "inquirer";
import figlet from "figlet";

// Custom
import { green, red, blink } from "./modules/colors.js";

const args = process.argv.slice(2);
const isPiped = args.includes("-piped");

/**
 * Gets data from data.json
 * @returns {Array} data
 */
export const getData = () => {
  const data = fs.readFileSync("./resources/data.json", "utf8");
  const dataParsed = JSON.parse(data);

  return dataParsed;
};

/**
 * Filters data based on provided difficulty and topic
 * @param {Array} data
 * @param {String} difficulty
 * @param {String} topic
 * @returns {Array} filtered data
 */
export const filterData = (data, difficulty, topics) => {
  const filteredData = data.filter((item) => {
    const itemTopics = item.topics?.map((topic) => topic.toLowerCase());
    const itemDifficulty = item.difficulty?.toLowerCase();
    topics = topics.map((topic) => topic.toLowerCase());
    difficulty = difficulty.toLowerCase();

    if (itemTopics === undefined || itemDifficulty === undefined) {
      throw new Error(
        `Topics or difficulty is undefined for ${item.message}\n{itemTopics: ${itemTopics}, itemDifficulty: ${itemDifficulty}}`
      );
    }

    const isTopicIncluded = itemTopics.some((topic) =>
      topics.includes(topic.toLowerCase())
    );
    const isDifficultyEqual = itemDifficulty === difficulty;

    return isTopicIncluded && isDifficultyEqual;
  });

  if (filteredData.length === 0) {
    throw new Error(
      `No data found for topics: ${topics} and difficulty: ${difficulty}`
    );
  }

  return filteredData;
};

/**
 * Randomizes data
 * @param {Array} data
 * @returns {Array} data randomized
 */
export const randomizeData = (data) => {
  return data.sort(() => Math.random() - 0.5);
};

/**
 * Prepares data for inquirer
 * @param {Array} data
 * @returns {Array} dataTransformed
 */
export const prepDataForInquirer = (data) => {
  const type = isPiped ? "rawlist" : "list";
  const dataTransformed = data.map((item, index) => {
    return { ...item, name: String(index), type };
  });

  return dataTransformed;
};

/**
 * Prompts user for topics
 * @returns {Promise<String>} answer
 */
const promptUserForTopics = async () => {
  // TODO - Make it such that topics are not hard-coded.
  // TODO - Make it such that counts of questions for each topic are displayed.
  const data = [
    {
      type: "checkbox",
      name: "topics",
      message: "Which topics would you like to be quizzed on?",
      choices: ["Standard", "Packages", "Express.js"],
      default: ["Standard", "Packages", "Express.js"],
    },
  ];

  const answer = await inquirer.prompt(data);

  return answer.topics;
};

/**
 * Prompts user for difficulty
 * @returns {Promise<String>} answer
 */
const promptUserForDifficulty = async () => {
  // TODO - Make it such that difficulty is not hard-coded.
  // TODO - Make it such that counts of questions for each difficulty are displayed.
  const data = [
    {
      type: "list",
      name: "difficulty",
      message: "What difficulty would you like to play?",
      choices: ["Moderate"],
      default: "Moderate",
    },
  ];

  const answer = await inquirer.prompt(data);

  return answer.difficulty;
};

const generateReport = (answers, data) => {
  const report = [];
  let score = 100;

  for (let i = 0; i < data.length; i++) {
    const question = data[i];
    const correctAnswer = question.choices[question.correct_answer_index];
    const answer = answers[String(i)];

    report.push({
      question: question.message,
      answer,
      isCorrect: correctAnswer === answer,
      score: correctAnswer === answer ? score : (score -= 100 / data.length),
    });
  }

  return report;
};

/**
 * Logs result to console
 * @param {Array} report
 * @returns {void}
 */
const logResult = (report) => {
  const correctAnswers = report.filter((item) => item.isCorrect);
  const incorrectAnswers = report.filter((item) => !item.isCorrect);
  const score = report[report.length - 1].score.toFixed(2);
  const questionsAnsweredIncorrectly = incorrectAnswers
    .map((report) => `- ${report.question}`)
    .join("\n");
  // Variables below to store references with or without stdout escape sequences / stdout effects.
  let gradeMessage;
  let scoreMessage;
  let incorrectAnswersMessage;

  // If the process is piped, then we can avoid using escape sequences / stdout effects
  if (isPiped) {
    gradeMessage = `Grade: ${score}%`;
    scoreMessage = `${score >= 70 ? "Passed" : "Failed"}`;
    incorrectAnswersMessage = questionsAnsweredIncorrectly;
  } else {
    gradeMessage = blink(`Grade: ${score}%`);
    scoreMessage = `${score >= 70 ? green("Passed") : red("Failed")}`;
    incorrectAnswersMessage = red(questionsAnsweredIncorrectly);
  }

  console.clear();
  console.log(`\n\nCorrect answers: ${correctAnswers.length}`);
  console.log(`Incorrect answers: ${incorrectAnswers.length}`);
  console.log(gradeMessage);
  console.log(scoreMessage);
  console.log(`\nQuestions answered incorrectly:\n${incorrectAnswersMessage}`);
};

const main = async () => {
  const data = getData();
  let takeQuiz = true;
  let topics;
  let difficulty;
  let filteredData;

  while (takeQuiz) {
    console.clear();
    console.log(figlet.textSync("Node.js Quiz"));

    // List question types should be avoided when piping data to the child process for now
    if (!isPiped) {
      // TODO - Make it such that data is filtered based on first prompt prior to second prompt.
      topics = await promptUserForTopics();
      difficulty = await promptUserForDifficulty();
      filteredData = filterData(data, difficulty, topics);
    }

    const dataRandomized = randomizeData(filteredData || data);
    const preppedData = prepDataForInquirer(dataRandomized);
    const answers = await inquirer.prompt(preppedData);
    const report = generateReport(answers, preppedData);

    logResult(report);

    // If the process is piped, then we can exit the process after the quiz is taken
    // This is used to avoid formatting issues when syncing with the web client.
    if (isPiped) {
      process.exit(0);
    }

    // Need to wrap await with parentheses as to access the retake property after the promise resolves
    takeQuiz = (
      await inquirer.prompt([
        {
          type: "confirm",
          name: "retake",
          message: `${blink("Would you like to retake the quiz")}?`,
          default: false,
          prefix: "\n\n",
        },
      ])
    ).retake;
  }
};

main();
