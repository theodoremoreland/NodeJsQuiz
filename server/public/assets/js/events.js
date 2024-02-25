const startButton = document.querySelector("button");
const textArea = document.querySelector("textarea");
const linePrefix = "> ";
const commandPrompt = `Node.js Quiz\n${linePrefix}`;
const answerPrefix = "Answer: ";
const linePrefixLength = linePrefix.length;
const answerPrefixLength = answerPrefix.length;
const messageHistoryStack = []; // Stack preserving websocket message history

// Regular expressions
const ellipsisRegex = new RegExp("start[.]{1,3}$", "gm");
const questionRegex = new RegExp(`^[?] `);
const answerRegex = new RegExp(`(?<=${answerPrefix}).+`, "gm");

let loadingIntervalId;
let webSocket;

textArea.value = commandPrompt;

const findAnswer = (message) => {
  const answerSearch = message.split("Answer: ");
  const answer = answerSearch[answerSearch.length - 1]?.trim();

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
      const data = event.data?.toString().replace(/\n+$/gm, "") || "";
      const isAnswer = answerRegex.test(data);

      /**
       * The client sends the answer to the server,
       * then the server writes answer to the child process's stdin,
       * which in turn writes the answer to the stdout of the child process,
       * which is then sent back to the client.
       * So, if the data received from the server is an answer, then we don't want to display it.
       */
      if (isAnswer) {
        return;
      }

      /**
       * Always remove the last message from the stack if it's a question as
       * to only show the current question. Inquirer sometimes writes previously answered questions
       * to stdout alongside the answer corresponding to the user's input. However,
       * this has proven inconsistent and unreliable, so we'll just pop anything that
       * features a question from the stack.
       */
      if (
        questionRegex.test(messageHistoryStack[messageHistoryStack.length - 1])
      ) {
        console.log("popped", messageHistoryStack.pop());
      }

      clearInterval(loadingIntervalId);

      textArea.value = "";
      messageHistoryStack.push(data);

      messageHistoryStack.forEach((message) => {
        textArea.value += "\n\n" + message;
      });

      textArea.value = textArea.value.replace(ellipsisRegex, "start");
      textArea.scrollTop = textArea.scrollHeight; // Scroll to bottom of overflowed textarea
      textArea.focus();
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
