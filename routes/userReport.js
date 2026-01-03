const express = require("express");
const UserReport = require("../models/userReport");
const user = require("../models/user");

const router = express.Router();

/* ================= STORE USER REPORT ================= */
router.post("/store", async (req, res) => {
  try {
    const { user_id, quiz, debug, coding, math } = req.body;

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

    if (Array.isArray(coding) && coding.length > 0) {
      reportData.coding = coding;
    }

    if (Array.isArray(math) && math.length > 0) {
      reportData.math = math;
    }

    // At least one of quiz/debug should be provided
    if (!reportData.quiz && !reportData.debug && !reportData.coding && !reportData.math) {
      return res.status(400).json({
        message: "No quiz or debug or coding or math data provided"
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

router.post("/getresult", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "user_id is required" });
    }

    const report = await UserReport.findOne({ user_id });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "User report not found" });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
