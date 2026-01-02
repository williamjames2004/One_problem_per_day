const express = require("express");
const router = express.Router();
const Practice = require("../models/Code");

router.post("/create", async (req, res) => {
  try {
    const {
      program_id,
      program_name,
      problem_statement,
      constraints,
      language,
      test_cases,
      difficulty,
      tags,
      max_score
    } = req.body;

    if (!program_id || !program_name || !problem_statement || !test_cases) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const exists = await Practice.findOne({ program_id });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Program ID already exists"
      });
    }

    const practice = await Practice.create({
      program_id,
      program_name,
      problem_statement,
      constraints,
      language,
      test_cases,
      difficulty,
      tags,
      max_score
    });

    res.status(201).json({
      success: true,
      message: "Practice problem created successfully",
      data: practice
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
    const problems = await Practice.find(
      {},
      {
        _id: 0,
        program_id: 1,
        program_name: 1,
        difficulty: 1,
        tags: 1
      }
    );

    res.json({
      success: true,
      count: problems.length,
      data: problems
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

    const problem = await Practice.findOne(
      { program_id },
      {
        _id: 0,
        program_id: 1,
        program_name: 1,
        problem_statement: 1,
        constraints: 1,
        difficulty: 1,
        tags: 1,
        language: 1
      }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    res.json({
      success: true,
      data: problem
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;