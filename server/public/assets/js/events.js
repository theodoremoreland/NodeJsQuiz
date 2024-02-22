const linePrefix = "$ ";
let webSocket;

window.onload = () => {
  const startButton = document.querySelector("button");
  const textArea = document.querySelector("textarea");

  startButton.addEventListener("click", () => {
    // Create a new WebSocket.

    if (webSocket) {
      startButton.textContent = "Start";
      startButton.style.backgroundColor = "green";

      webSocket.close();
    } else {
      startButton.textContent = "Stop";
      startButton.style.backgroundColor = "red";

      webSocket = new WebSocket("ws://localhost:3000");

      webSocket.onopen = () => {
        console.log("WebSocket connection opened.");
      };

      webSocket.onmessage = (event) => {
        textArea.value += event.data;
      };

      webSocket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      webSocket.onerror = (error) => {
        console.error(error);
      };
    }
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
