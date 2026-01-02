// test_judge.js
const { spawn } = require("child_process");
const fs = require("fs");

const payload = fs.readFileSync("test_payload.json", "utf-8");

const py = spawn("python", ["judge/judge.py"]);

let output = "";

py.stdin.write(payload);
py.stdin.end();

py.stdout.on("data", data => {
  output += data.toString();
});

py.on("close", () => {
  console.log(output);
});