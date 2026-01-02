const express = require("express");
const router = express.Router();
const Debug = require("../models/Debug");
const { spawn } = require("child_process");

router.post("/create", async (req, res) => {
  try {
    const {
      program_id,
      program_name,
      buggy_program,
      language,
      test_cases,
      max_score
    } = req.body;

    if (!program_id || !program_name || !buggy_program || !test_cases) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const exists = await Debug.findOne({ program_id });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Program ID already exists"
      });
    }

    const debugProgram = await Debug.create({
      program_id,
      program_name,
      buggy_program,
      language,
      test_cases,
      max_score
    });

    res.status(201).json({
      success: true,
      message: "Debug program created successfully",
      data: debugProgram
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.get("/all", async (req, res) => {
  try {
    const programs = await Debug.find(
      {},
      { _id: 0, program_id: 1, program_name: 1 }
    );

    res.json({
      success: true,
      count: programs.length,
      data: programs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
router.post("/by-id", async (req, res) => {
  try {
    const { program_id } = req.body;

    if (!program_id) {
      return res.status(400).json({
        success: false,
        message: "program_id is required"
      });
    }

    const program = await Debug.findOne(
      { program_id },
      {
        _id: 0,
        program_id: 1,
        program_name: 1,
        buggy_program: 1,
        language: 1,
        test_cases: 1,   // ✅ ADD THIS
        max_score: 1     // ✅ OPTIONAL but useful
      }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    res.json({
      success: true,
      data: program
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.post("/run", async (req, res) => {
  try {
    const { code, testCases } = req.body;

    // Prepare payload for Python judge
    const payload = JSON.stringify({ code, testCases });

    const py = spawn("python", ["judge/judge.py"]);

    let output = "";
    let errorOutput = "";

    py.stdin.write(payload);
    py.stdin.end();

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (codeExit) => {
      if (errorOutput) {
        return res.status(500).json({ error: errorOutput });
      }

      try {
        // Parse judge output (passed, total, errors)
        const result = JSON.parse(output);

        // Send result to /submit/store internally or return to client
        return res.json(result);
      } catch (e) {
        return res.status(500).json({ error: "Failed to parse judge output" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;