// Imports
const input = require('readline-sync');

const name = input.question("Enter your name:  ");
const questions = [
  '1) True or false: 5000 meters = 5 kilometers.'
  , '2) (5 + 3)/2 * 10 = ?'
  , '3) Given the array [8, "Orbit", "Trajectory", 45], what entry is at index 2?'
  , '4) Who was the first American woman in space?'
  , '5) What is the minimum crew size for the International Space Station (ISS)?'
];
const answers = ['true', '40', 'trajectory', 'sally ride', '3'];
let reply = [];
let score = 100;
let grade = "PASSED";
let correct = 5;

for (let i = 0; i < questions.length; i++) {
  response = input.question(questions[i]);
  reply.push(response.toLowerCase());
}

for (let i in answers) {
  if (answers[i] !== reply[i]) {
    score -= 20;
    correct--;
  }
}

if (score < 80) { grade = "FAILED" }

let output = `
Candidate Name: ${name}

${questions[0]}
Your Answer: ${reply[0]}
Correct Answer: true

${questions[1]}
Your Answer: ${reply[1]}
Correct Answer: 40

${questions[2]}
Your Answer: ${reply[2]}
Correct Answer: trajectory

${questions[3]}
Your Answer: ${reply[3]}
Correct Answer: sally ride

${questions[4]}
Your Answer: ${reply[4]}
Correct Answer: 3

>>> Overall Grade: ${score}% (${correct} of 5 responses correct) <<<
>>> Status: ${grade} <<<
`;

console.log(output);