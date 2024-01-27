// Native library
import fs from "fs";

// Third party
import inquirer from "inquirer";

/**
 * Prepares data for inquirer
 * @returns {Array} dataTransformed
 */
export const prepDataForInquirer = () => {
  const data = fs.readFileSync("./resources/data.json", "utf8");
  const dataParsed = JSON.parse(data);
  const dataTransformed = dataParsed.map((item) => {
    // Need to replace periods with @ because periods are interpreted as paths in inquirer
    return { ...item, name: item.message.replaceAll(".", "@"), type: "list" };
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
      choices: ["Easy", "Medium", "Hard"],
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
  return data.filter((item) => {
    const itemTopics = item.topics?.map((topic) => topic.toLowerCase());
    const itemDifficulty = item.difficulty?.toLowerCase();
    topics = topics.map((topic) => topic.toLowerCase());

    if (itemTopics === undefined || itemDifficulty === undefined) {
      throw new Error(
        `Topics or difficulty is undefined for ${item.message}\n{itemTopics: ${itemTopics}, itemDifficulty: ${itemDifficulty}}`
      );
    }

    const isTopicIncluded = itemTopics.some((topic) =>
      topics.includes(topic.toLowerCase())
    );
    const isDifficultyEqual = itemDifficulty === difficulty.toLowerCase();

    return isTopicIncluded && isDifficultyEqual;
  });
};

const main = async () => {
  const data = prepDataForInquirer();
  const topics = await promptUserForTopics();
  const difficulty = await promptUserForDifficulty();
  const filteredData = filterData(data, difficulty, topics);
  const answers = await inquirer.prompt(filteredData);

  console.log(answers);
};

main();
