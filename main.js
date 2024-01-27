// Native library
import fs from "fs";

// Third party
import inquirer from "inquirer";

const main = async () => {
  const data = fs.readFileSync("./resources/data.json", "utf8");
  const dataParsed = JSON.parse(data);
  const dataTransformed = dataParsed.map((item) => {
    return { ...item, name: item.message, type: "list" };
  });

  const answers = await inquirer.prompt(dataTransformed);

  console.log(answers);
};

main();
