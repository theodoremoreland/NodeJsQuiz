import http from "http";
import { spawn } from "child_process";

import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
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
