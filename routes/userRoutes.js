const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/auth/register", async (req, res) => {
  console.log("Register");
  try {
    const {
      name,
      user_id,
      age,
      email,
      phone,
      country,
      password
    } = req.body;

    // Check if user_id exists
    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists" });
    }
    const passwordRegex = /^[a-zA-Z0-9@#]+$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password allows only alphanumeric and @ #"
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      user_id,
      age,
      email,
      phone,
      country,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ success: true, message: "Registration successful", user: user_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ================= LOGIN ================= */
router.post("/auth/login", async (req, res) => {
  console.log("Login");
  try {
    const { user_id, password } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ success: true, message: "Login successful", user: user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/auth/checkuserid", async (req, res) => {
  console.log("UserId");
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "user_id is required"
      });
    }

    if (user_id.length < 6) {
      return res.status(400).json({
        message: "user_id must be at least 6 characters"
      });
    }

    const user = await User.findOne({ user_id });

    if (user) {
      return res.json({
        exists: true,
        message: "User ID already exists"
      });
    }

    res.json({
      exists: false,
      message: "User ID available"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
router.post("/user/getdata", async (req, res) => {
  try{
    const { user_id } = req.body;
    const user = await User.findOne({user_id});
    if (user){
      return res.json({
        success: true,
        user: user
      });
    }
    else{
      return res.json({
        success: false,
        message: "User Id doesn't exist"
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

module.exports = router;