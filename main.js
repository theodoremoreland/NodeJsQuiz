// Native library
const fs = require('fs');

// Third party
const input = require('readline-sync');


console.clear();
const user_name = input.question("Enter your name:  ");
const questions = fs.readFileSync('resources/questions.txt', 'utf8').split("\n").map((x) => x.trim());
const correct_answers = fs.readFileSync('resources/answers.txt', 'utf8').split("\n").map((x) => x.trim());


// Effects for stdout.
const blink = '\x1b[5m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const colorEscape = '\x1b[0m';


function askQuestions(questions) {
  let user_answers = [];
  for (let i = 0; i < questions.length; i++) {
    let user_answer = input.question(questions[i] + " ");
    user_answers.push(user_answer);
  }
  return user_answers;
}


function createReport(questions, correct_answers, user_answers, report=[]) {
  if (questions.length == 0) { return report; }

    question = questions.shift();
    user_answer = user_answers.shift();
    correct_answer = correct_answers.shift();
    QnA = {"question": question, "user_answer": user_answer.toLowerCase(), "correct_answer": correct_answer}
    report.push(QnA);

    return createReport(questions, correct_answers, user_answers, report);
}


function gradeReport(report, passing_grade) {
  let score = 100;
  let to_be_deducted = 100 / report.length; // The number of points deducted for an incorrect answer.
  let number_correct = 0;
   
  for (let i = 0; i < report.length; i++) {
    QnA = report[i];
    if (QnA["user_answer"] !== QnA["correct_answer"]) { score -= to_be_deducted; }
    else { number_correct += 1; }
  }

  let pass = score >= passing_grade ? `${green}PASSED${colorEscape}` : `${red}FAILED${colorEscape}`;
  score = score < 0 ? 0 : score;

  return {"score": score, "number_correct": number_correct, "pass": pass};
}


function showReport(user_name, report, grade) {
  console.clear();
  console.log(`\n\tCandidate Name: ${cyan}${user_name}${colorEscape}`);

  for (let i = 0; i < report.length; i++) {
    QnA = report[i];
    question = QnA["question"]
    user_answer = QnA["user_answer"]
    correct_answer = QnA["correct_answer"]

    console.log(`
    ${question}
    Your Answer: ${user_answer}
    Correct Answer: ${correct_answer}`);
  }

  console.log(`
  >>> Overall Grade: ${cyan}${grade.score}%${colorEscape} (${grade.number_correct} of ${report.length} responses correct) <<<
  >>> Status: ${grade.pass} <<<`);
}


function main() {
  let user_answers = askQuestions(questions);
  let report = createReport(questions, correct_answers, user_answers);
  let grade = gradeReport(report, 80);

  showReport(user_name, report, grade);
}

main();