// Native library
const fs = require("fs");

// Third party
const input = require("inquirer");

// Effects for stdout.
const blink = "\x1b[5m";
const cyan = "\x1b[36m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";
const colorEscape = "\x1b[0m";

function askQuestions(data) {
  const user_answers = [];

  for (let i = 0; i < data.length; i++) {
    const questionMetadata = data[i];
    const user_answer = input.question(questionMetadata.question + " ");

    user_answers.push(user_answer);
  }

  return user_answers;
}

function createReport(questions, correct_answers, user_answers, report = []) {
  if (questions.length == 0) {
    return report;
  }

  const question = questions.shift();
  const user_answer = user_answers.shift();
  const correct_answer = correct_answers.shift();
  const QnA = {
    question: question,
    user_answer: user_answer.toLowerCase(),
    correct_answer: correct_answer,
  };

  report.push(QnA);

  return createReport(questions, correct_answers, user_answers, report);
}

function gradeReport(report, passing_grade) {
  const to_be_deducted = 100 / report.length; // The number of points deducted for an incorrect answer.
  let score = 100;
  let number_correct = 0;

  for (let i = 0; i < report.length; i++) {
    const QnA = report[i];

    if (QnA["user_answer"] !== QnA["correct_answer"]) {
      score -= to_be_deducted;
    } else {
      number_correct += 1;
    }
  }

  const pass =
    score >= passing_grade
      ? `${green}PASSED${colorEscape}`
      : `${red}FAILED${colorEscape}`;
  score = score < 0 ? 0 : score;

  return { score: score, number_correct: number_correct, pass: pass };
}

function showReport(user_name, report, grade) {
  let report_header = `\n\tCandidate Name: ${cyan}${user_name}${colorEscape}`;
  let report_body = "";
  let report_footer = `
  >>> Overall Grade: ${cyan}${grade.score}%${colorEscape} (${grade.number_correct} of ${report.length} responses correct) <<<
  >>> Status: ${grade.pass} <<<`;

  for (let i = 0; i < report.length; i++) {
    const QnA = report[i];
    const question = QnA["question"];
    const user_answer = QnA["user_answer"];
    const correct_answer = QnA["correct_answer"];

    report_body += `${question}
    Your Answer: ${user_answer}
    Correct Answer: ${correct_answer}`;
  }

  return `${report_header}${report_body}${report_footer}`;
}

function main() {
  console.clear();

  const user_name = input.question("Enter your name:  ");
  // Converts strings to arrays, then trims whitespace and line breaks from each element.
  const data = fs.readFileSync("resources/data.json", "utf8");

  const dataJSON = JSON.parse(data);

  console.log(dataJSON);

  console.clear();

  const user_answers = askQuestions(dataJSON);
  const report = createReport(dataJSON, correct_answers, user_answers);
  const grade = gradeReport(report, 80);

  console.clear();

  showReport(user_name, report, grade);
}

main();
