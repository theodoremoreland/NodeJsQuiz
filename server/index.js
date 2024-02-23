// Native modules
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// Third-party
import express from "express";
import { WebSocketServer } from "ws";

// Server initialization
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Valid commands
const up = "\\033[A";
const down = "\\033[B";
const left = "\\033[D";
const right = "\\033[C";
const enter = "\\r";

// Middleware
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  const process = spawn("node", [path.join(__dirname, "main.js"), "-piped"]);

  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);

    ws.send(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ws.on("error", console.error);

  ws.on("message", (message) => {
    console.log("received: %s", message);

    process.stdin.write(message);
  });

  ws.on("close", () => {
    process.kill();
  });
});

app.get("/", (_, res) => {
  res.sendFile("index.html");
});

// server.on("request", app);
server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
