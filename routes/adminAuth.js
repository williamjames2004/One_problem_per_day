const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { admin_code, password } = req.body;

    const existingAdmin = await Admin.findOne({ admin_code });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({ admin_code, password });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { admin_code, password } = req.body;

    // 1. Validation
    if (!admin_code || !password) {
      return res.status(400).json({
        message: "Admin code and password are required",
      });
    }

    // 2. Check admin exists
    const admin = await Admin.findOne({ admin_code });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin code or password",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid admin code or password",
      });
    }

    // 4. Login success
    res.status(200).json({
        success: true,
        admin_code: admin.admin_code,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;