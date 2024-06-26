// Native modules
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// Third-party
import express from "express";
import { WebSocketServer } from "ws";

const port = process?.env?.PORT ? Number(process.env.PORT) : 8080;

// Server initialization
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const escapeSequenceRegex = /\x1b\[[0-9;]*[a-zA-Z]/gm;

// Valid commands
const enter = "\r";

let clientId = 0;

// Middleware
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  const aClientId = ++clientId;
  console.log(
    `Client #${aClientId} connected via WebSocket. Spawning child process...`
  );

  const process = spawn("node", [path.join(__dirname, "cli.js"), "-piped"]);

  process.stdout.on("data", (data) => {
    const dataString = data.toString("utf8");
    const isPrecursorToEscapeSequence = dataString[0] === "\x1b";
    const isNewline = dataString === "\n";
    console.log(`Child process ${process.pid} stdout:\n${dataString}`);

    if (isPrecursorToEscapeSequence || isNewline) {
      return;
    }

    ws.send(dataString.replace(escapeSequenceRegex, ""));
  });

  process.stderr.on("data", (data) => {
    console.error(`Child process ${process.pid} stderr:\n${data}`);
  });

  process.on("close", (code) => {
    console.log(`Child process ${process.pid} exited with code ${code}`);
    console.log(`Closing WebSocket connection for client #${aClientId}...`);

    ws?.close();
  });

  ws.on("error", console.error);

  ws.on("message", (message) => {
    console.log(
      `Received following message from client:\n----------\n${message}\n----------\n`
    );

    process.stdin.write(`${message}${enter}`);
  });

  ws.on("close", () => {
    console.log(`Client #${aClientId} disconnected from WebSocket.`);

    process?.kill();
  });
});

app.get("/", (_, res) => {
  res.sendFile("index.html");
});

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});
