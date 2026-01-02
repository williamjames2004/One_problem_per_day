const express = require("express");
const router = express.Router();
const Math = require("../models/Math");

router.post("/create", async (req, res) => {
  try {
    const {
      qtn_id,
      domain,
      question,
      clue,
      correct_answers,
      answer_type,
      tolerance,
      unit,
      difficulty,
      max_score
    } = req.body;

    if (!qtn_id || !domain || !question || !correct_answers) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const exists = await Math.findOne({ qtn_id });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Question ID already exists"
      });
    }

    const mathQuestion = await Math.create({
      qtn_id,
      domain,
      question,
      clue,
      correct_answers,
      answer_type,
      tolerance,
      unit,
      difficulty,
      max_score
    });

    res.status(201).json({
      success: true,
      message: "Math question created successfully",
      data: mathQuestion
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
    const questions = await Math.find(
      {},
      {
        _id: 0,
        qtn_id: 1,
        domain: 1,
        difficulty: 1
      }
    );

    res.json({
      success: true,
      count: questions.length,
      data: questions
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
    const { qtn_id } = req.body;

    if (!qtn_id) {
      return res.status(400).json({
        success: false,
        message: "qtn_id is required"
      });
    }

    const question = await Math.findOne(
      { qtn_id },
      {
        _id: 0,
        qtn_id: 1,
        domain: 1,
        question: 1,
        clue: 1,
        answer_type: 1,
        unit: 1,
        difficulty: 1
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    res.json({
      success: true,
      data: question
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