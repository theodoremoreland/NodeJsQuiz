const linePrefix = "> ";
const commandPrompt = `Node.js Quiz\n${linePrefix}`;
const answerPrefix = "Answer: ";
const linePrefixLength = linePrefix.length;
const answerPrefixLength = answerPrefix.length;
const startButton = document.querySelector("button");
const textArea = document.querySelector("textarea");
const ellipsisRegex = new RegExp("start[.]{1,3}$", "gm");
let loadingIntervalId;
let webSocket;

textArea.value = commandPrompt;

const startQuiz = () => {
  if (webSocket) {
    startButton.textContent = "Start";
    startButton.style.backgroundColor = "green";

    webSocket.close();
  } else {
    startButton.textContent = "Stop";
    startButton.style.backgroundColor = "red";
    textArea.value += "start";

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
    };

    webSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    webSocket.onerror = (error) => {
      console.error(error);

      clearInterval(loadingIntervalId);
    };
  }
};

startButton.addEventListener("click", startQuiz);

textArea.addEventListener("focus", () => {
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
    // Send the message to the server.

    textArea.value = currentText + "\n\n" + commandPrompt;
  }
});
