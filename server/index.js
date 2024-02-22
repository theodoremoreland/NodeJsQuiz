import http from "http";
import { spawn } from "child_process";

import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Valid commands
const up = "\\033[A";
const down = "\\033[B";
const left = "\\033[D";
const right = "\\033[C";
const enter = "\\r";

wss.on("connection", (ws) => {
  const ls = spawn("node", ["main.js"]);

  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);

    ws.send(data.toString());
  });

  ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ws.on("error", console.error);

  ws.on("message", (message) => {
    console.log("received: %s", message);

    ls.stdin.write(message);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});
