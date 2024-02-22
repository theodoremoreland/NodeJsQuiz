import http from "http";
import { spawn } from "child_process";

import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("error", console.error);

wss.on("open", function open() {
  wss.send("something");
});

wss.on("message", function message(data) {
  console.log("received: %s", data);
});

app.get("/", (req, res) => {
  const ls = spawn("node", ["main.js"]);

  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});
