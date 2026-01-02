const express = require("express");
const UserReport = require("../models/userReport");
const user = require("../models/user");

const router = express.Router();

/* ================= STORE USER REPORT ================= */
router.post("/store", async (req, res) => {
  try {
    const { user_id, quiz, debug } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }
    const checkuser = await user.findOne({user_id});
    if(!checkuser){
      return res.status(404).json({success: false, message: "User not found"});
    }
    // Prepare object to save
    const reportData = { user_id };

    if (Array.isArray(quiz) && quiz.length > 0) {
      reportData.quiz = quiz;
    }

    if (Array.isArray(debug) && debug.length > 0) {
      reportData.debug = debug;
    }

    // At least one of quiz/debug should be provided
    if (!reportData.quiz && !reportData.debug) {
      return res.status(400).json({
        message: "No quiz or debug data provided"
      });
    }

    // Save to DB
    const report = new UserReport(reportData);
    await report.save();

    res.status(200).json({
      success: true,
      message: "User report stored successfully",
      report
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
