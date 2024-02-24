const startButton = document.querySelector("button");
const textArea = document.querySelector("textarea");
const linePrefix = "> ";
const commandPrompt = `Node.js Quiz\n${linePrefix}`;
const answerPrefix = "Answer: ";
const linePrefixLength = linePrefix.length;
const answerPrefixLength = answerPrefix.length;
const ellipsisRegex = new RegExp("start[.]{1,3}$", "gm");
const answerRegex = new RegExp(`${answerPrefix}(.*)$`, "gm");
let loadingIntervalId;
let webSocket;

textArea.value = commandPrompt;

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
      textArea.value += "\n" + event.data;

      clearInterval(loadingIntervalId);

      textArea.value = textArea.value.replace(ellipsisRegex, "start");
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
    const answer = answerRegex.exec(currentText)[1]?.trim(); // Capture group at index 1

    if (answer && isValidAnswer(answer)) {
      webSocket.send(`${answer}`);
    } else {
      textArea.value = currentText + "\n\n" + commandPrompt;
    }
  }
});
