// Native library
import fs from "fs";

// Third party
import inquirer from "inquirer";

/**
 * Prepares data for inquirer
 * @returns {Array} dataTransformed
 */
const prepDataForInquirer = () => {
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
 * @returns {String} answer
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
 * @returns {String} answer
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
const filterData = (data, difficulty, topic) => {
  return data.filter((item) => {
    const itemTopics = item.topics.map((topic) => topic.toLowerCase());
    const itemDifficulty = item.difficulty.toLowerCase();

    if (itemTopics === undefined || itemDifficulty === undefined) {
      throw new Error(`Topics or difficulty is undefined for ${item.message}`);
    }

    return itemTopics.includes(topic) && itemDifficulty === difficulty;
  });
};

const main = async () => {
  const data = prepDataForInquirer();

  const answers = await inquirer.prompt(data);

  console.log(answers);
};

main();
