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
    // TODO need to get inquirer to ignore period in name as opposed to interpreting it as directory of sorts
    return { ...item, name: item.message, type: "list" };
  });

  return dataTransformed;
};

const main = async () => {
  const data = prepData();

  const answers = await inquirer.prompt(data);

  console.log(answers);
};

main();
