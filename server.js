import { spawn } from "child_process";

import express from "express";

const app = express();

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
