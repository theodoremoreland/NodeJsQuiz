const startButton = document.querySelector("button");
const textArea = document.querySelector("textarea");
const linePrefix = "> ";
const commandPrompt = `Node.js Quiz\n${linePrefix}`;
const answerPrefix = "Answer: ";
const invalidStdinMessage = ">> Please enter a valid index";
const linePrefixLength = linePrefix.length;
const answerPrefixLength = answerPrefix.length;
const validQuizInputs = ["y", "n", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const validCommands = ["start", "help", "source", "github", "linkedin"];

// Regular expressions
const ellipsisRegex = new RegExp("start[.]{1,3}$", "gm");
const questionRegex = new RegExp(`^[?] `);
const answerRegex = new RegExp(`(?<=${answerPrefix}).+`, "gm");

/** This is used to refresh on screen text while also popping and/or skipping text
 * that is not needed.
 */
let messageHistoryStack = []; // Stack preserving websocket message history
let isQuizRunning = false;
let loadingIntervalId;
let webSocket;

const findCommand = (message) => {
  const commandSearch = message.split(linePrefix);
  const command = commandSearch[commandSearch.length - 1]?.trim();

  return command;
};

const findAnswer = (message) => {
  const answerSearch = message.split("Answer: ");
  const answer = answerSearch[answerSearch.length - 1]?.trim();

  return answer;
};

const isValidCommand = (command) => {
  let isValid = false;

  if (validCommands.includes(command?.toLowerCase())) {
    isValid = true;
  }

  return isValid;
};

const isValidAnswer = (answer) => {
  let isValid = false;

  if (validQuizInputs.includes(answer?.toLowerCase())) {
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

    messageHistoryStack = [];
    messageHistoryStack.push(commandPrompt + "start");

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
      isQuizRunning = true;
      /**
       * Remove leading and trailing newline characters. Trim is not used
       * because it will ruin formatting that leads with spaces or tabs.
       */
      let data =
        event.data?.toString().replace(/\n+$/gm, "").replace(/^\n+/, "") || "";
      const isAnswer = answerRegex.test(data);

      if (data.includes(invalidStdinMessage)) {
        data += "\n" + "  Answer: ";
      }

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

      messageHistoryStack.forEach((message, index) => {
        if (index === 0) {
          textArea.value += message;

          return;
        }

        textArea.value += "\n" + message;
      });

      textArea.value = textArea.value.replace(ellipsisRegex, "start");
      textArea.scrollTop = textArea.scrollHeight; // Scroll to bottom of overflowed textarea
      textArea.focus();
    };

    webSocket.onclose = () => {
      isQuizRunning = false;
      startButton.textContent = "Start";
      startButton.style.backgroundColor = "green";
      textArea.value = commandPrompt;
      textArea.focus();

      console.log("WebSocket connection closed.");
      clearInterval(loadingIntervalId);

      webSocket = null;
    };

    webSocket.onerror = (error) => {
      isQuizRunning = false;
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
    if (isQuizRunning) {
      const answer = findAnswer(currentText);

      webSocket.send(answer || "");
    } else {
      const command = findCommand(currentText);

      if (isValidCommand(command)) {
        switch (command.toLowerCase()) {
          case "start":
            startQuiz();

            break;
          case "help":
            textArea.value =
              currentText +
              "\n\n" +
              "This program starts a Node.js CLI child process on an Express server that runs a Node.js quiz. With the aid of WebSocket API, you can start and stop the quiz, answer questions, and enter commands." +
              "\n\nValid commands include:\n" +
              validCommands.join("\n") +
              "\n\n" +
              commandPrompt;

            break;
          case "github":
            textArea.value = currentText + "\n\n" + commandPrompt;
            window.open("https://github.com/theodoremoreland", "_blank");

            break;
          case "linkedin":
            textArea.value = currentText + "\n\n" + commandPrompt;
            window.open(
              "https://www.linkedin.com/in/theodore-moreland/",
              "_blank"
            );

            break;
          case "source":
            textArea.value = currentText + "\n\n" + commandPrompt;
            window.open(
              "https://github.com/theodoremoreland/NodeJsQuiz",
              "_blank"
            );

            break;
          default:
            textArea.value = currentText + "\n\n" + commandPrompt;
        }
      } else {
        textArea.value =
          currentText +
          "\n\n" +
          `Not a valid command. Valid commands include:\n${validCommands.join(
            "\n"
          )}` +
          "\n\n" +
          commandPrompt;
      }
    }
  }
});

textArea.value = commandPrompt;
textArea.focus();
