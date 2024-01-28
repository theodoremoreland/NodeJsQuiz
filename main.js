// Native library
import fs from "fs";

// Third party
import inquirer from "inquirer";

export const getData = () => {
  const data = fs.readFileSync("./resources/data.json", "utf8");
  const dataParsed = JSON.parse(data);

  return dataParsed;
};

/**
 * Prepares data for inquirer
 * @param {Array} data
 * @returns {Array} dataTransformed
 */
export const prepDataForInquirer = (data) => {
  const dataTransformed = data.map((item, index) => {
    return { ...item, name: String(index), type: "list" };
  });

  return dataTransformed;
};

/**
 * Prompts user for topics
 * @returns {Promise<String>} answer
 */
const promptUserForTopics = async () => {
  const data = [
    {
      type: "checkbox",
      name: "topics",
      message: "What topics would you like to be quizzed on?",
      choices: ["Express.js", "Packages", "Standard"],
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
  const data = [
    {
      type: "list",
      name: "difficulty",
      message: "What difficulty would you like to play?",
      choices: ["Easy", "Moderate"],
    },
  ];

  const answer = await inquirer.prompt(data);

  return answer.difficulty;
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

const main = async () => {
  const data = getData();
  const topics = await promptUserForTopics();
  const difficulty = await promptUserForDifficulty();
  const filteredData = filterData(data, difficulty, topics);
  const dataRandomized = filteredData.sort(() => Math.random() - 0.5);
  const preppedData = prepDataForInquirer(dataRandomized);
  const answers = await inquirer.prompt(preppedData);

  console.log(answers);
};

main();
