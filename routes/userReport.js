const express = require("express");
const UserReport = require("../models/userReport");

const router = express.Router();

/* ================= STORE USER REPORT ================= */
router.post("/store", async (req, res) => {
  try {
    console.log(user_id+" "+quiz);

    if (!user_id || !Array.isArray(quiz)) {
      return res.status(400).json({
        message: "Invalid data format"
      });
    }

    const report = new UserReport({
      user_id,
      quiz
    });

    await report.save();

    res.status(200).json({
        success: true,
      message: "User report stored successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;