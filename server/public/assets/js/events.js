const linePrefix = "$ ";
let webSocket;

window.onload = () => {
  const startButton = document.querySelector("button");
  const textArea = document.querySelector("textarea");

  startButton.addEventListener("click", () => {
    // Create a new WebSocket.
  });

  textArea.addEventListener("focus", (event) => {
    textArea.selectionStart = textArea.value.length;
  });

  textArea.addEventListener("keydown", (event) => {
    const currentText = event.target.value;

    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "ArrowLeft"
    ) {
      if (currentText.slice(-2) === linePrefix) {
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

      textArea.value = currentText + "\n" + linePrefix;
    }
  });
};
