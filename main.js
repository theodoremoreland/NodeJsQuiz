// Native library
import fs from "fs";

// Third party
import inquirer from "inquirer";

/**
 * Prepares data for inquirer
 * @returns {Array} dataTransformed
 */
const prepData = () => {
  const data = fs.readFileSync("./resources/data.json", "utf8");
  const dataParsed = JSON.parse(data);
  const dataTransformed = dataParsed.map((item) => {
    // Need to replace periods with @ because periods are interpreted as paths in inquirer
    return { ...item, name: item.message.replaceAll(".", "@"), type: "list" };
  });

  return dataTransformed;
};

const main = async () => {
  const data = prepData();

  const answers = await inquirer.prompt(data);

  console.log(answers);
};

main();
