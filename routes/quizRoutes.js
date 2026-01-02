const express = require("express");
const Quiz = require("../models/Quiz");

const router = express.Router();

/* ================= POST : CREATE QUIZ ================= */
router.post("/create", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();

    res.status(201).json({
      message: "Quiz created successfully"
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

/* ================= GET : ALL QUIZ BASIC DETAILS ================= */
router.get("/all", async (req, res) => {
  try {
    const quizzes = await Quiz.find(
      {},
      "quiz_name quiz_id domain field"
    );

    res.json(quizzes);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* ================= POST : GET QUIZ BY QUIZ_ID ================= */
router.post("/by-id", async (req, res) => {
  try {
    const { quiz_id } = req.body;

    if (!quiz_id) {
      return res.status(400).json({
        message: "quiz_id is required"
      });
    }

    const quiz = await Quiz.findOne({ quiz_id });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }
    res.status(200).json(quiz);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;