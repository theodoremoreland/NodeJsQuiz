const startButton = document.querySelector("button");
const textArea = document.querySelector("textarea");
const linePrefix = "> ";
const commandPrompt = `Node.js Quiz\n${linePrefix}`;
const answerPrefix = "Answer: ";
const linePrefixLength = linePrefix.length;
const answerPrefixLength = answerPrefix.length;

// Regular expressions
const ellipsisRegex = new RegExp("start[.]{1,3}$", "gm");
const questionRegex = new RegExp(`^[?] `);
const questionPromptRegex = new RegExp(`${answerPrefix}$`, "gm");
const questionWithAnswerRegex = new RegExp(`(?<=${answerPrefix})[0-9]+`, "gm");

const messageHistory = [];
let loadingIntervalId;
let webSocket;

textArea.value = commandPrompt;

const findAnswer = (message) => {
  const answerSearch = questionWithAnswerRegex.exec(message);
  const answer = answerSearch[0]?.trim(); // Capture group at index 1

  return answer;
};

const isValidAnswer = (answer) => {
  let isValid = false;

  if (answer.toLowerCase() === "y" || answer.toLowerCase() === "n") {
    isValid = true;
  } else if (isNaN(answer)) {
    isValid = false;
  } else {
    isValid = true;
  }

  return isValid;
};

const startQuiz = () => {
  if (webSocket) {
    webSocket.close();
  } else {
    startButton.textContent = "Stop";
    startButton.style.backgroundColor = "red";
    textArea.value += "start";

    // Add loading ellipsis
    loadingIntervalId = setInterval(() => {
      const lastThreeChars = textArea.value.slice(-3);

      switch (lastThreeChars) {
        case "...":
          textArea.value = textArea.value.slice(0, -3) + ".";
          break;
        default:
          textArea.value += ".";
      }
    }, 300);

    webSocket = new WebSocket("ws://localhost:3000");

    webSocket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    webSocket.onmessage = (event) => {
      const data = event.data?.replace(/\n+$/gm, "") || "";
      const isQuestion = questionRegex.test(data);
      const isQuestionPrompt = questionPromptRegex.test(data);
      const isQuestionWithAnswer = questionWithAnswerRegex.test(data);

      console.log("data:", data);
      console.log(`isQuestion`, isQuestion);
      console.log(`isQuestionPrompt`, isQuestionPrompt);
      console.log(`isQuestionWithAnswer`, isQuestionWithAnswer);

      if (isQuestion) {
        if (isQuestionWithAnswer) {
          return;
        } else {
          textArea.value = "\n\n" + data;
        }
      } else {
        textArea.value = "\n\n" + data;
      }

      textArea.value = textArea.value.replace(ellipsisRegex, "start");
      textArea.scrollTop = textArea.scrollHeight; // Scroll to bottom of overflowed textarea
      textArea.focus();

      clearInterval(loadingIntervalId);
    };

    webSocket.onclose = () => {
      startButton.textContent = "Start";
      startButton.style.backgroundColor = "green";
      textArea.value = commandPrompt;
      textArea.focus();

      console.log("WebSocket connection closed.");
      clearInterval(loadingIntervalId);

      webSocket = null;
    };

    webSocket.onerror = (error) => {
      console.error(error);

      clearInterval(loadingIntervalId);
    };
  }
};

startButton.addEventListener("click", startQuiz);

// Force cursor to end of textarea
textArea.addEventListener("focus", () => {
  textArea.selectionStart = textArea.value.length;
});

// Force cursor to end of textarea
textArea.addEventListener("click", () => {
  textArea.selectionStart = textArea.value.length;
});

textArea.addEventListener("keydown", (event) => {
  const currentText = event.target.value;

  if (
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft"
  ) {
    if (
      currentText.slice(-linePrefixLength) === linePrefix ||
      currentText.slice(-answerPrefixLength) === answerPrefix
    ) {
      event.preventDefault();
    }
  }

  if (event.key === "ArrowRight" && currentText.slice(-1) === "\n") {
    event.preventDefault();
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }

  if (event.key === "Enter") {
    event.preventDefault();
  }
});

textArea.addEventListener("keyup", (event) => {
  const currentText = event.target.value;

  if (event.key === "Enter") {
    const answer = findAnswer(currentText);

    if (answer && isValidAnswer(answer)) {
      webSocket.send(answer);
    } else {
      textArea.value = currentText + "\n\n" + commandPrompt;
    }
  }
});
