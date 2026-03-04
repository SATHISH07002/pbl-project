/**
 * Auth Routes - InternVerify
 * Register, Login, Profile, Profile Update
 */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateMiddleware");

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed" });
  }
});

// @route   POST /api/auth/login
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      token,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/auth/profile
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const updates = {};
      const allowed = [
        "name",
        "rollNumber",
        "degree",
        "branch",
        "department",
        "collegeName",
        "companyName",
      ];

      allowed.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      if (req.file) {
        updates.profileImage = req.file.filename;
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message || "Update failed" });
    }
  }
);

// @route   GET /api/auth/colleges - List college users (for dropdowns)
router.get("/colleges", protect, async (req, res) => {
  const colleges = await User.find({ role: "college" })
    .select("name _id collegeName")
    .lean();
  res.json(colleges);
});

// @route   GET /api/auth/companies - List company users
router.get("/companies", protect, async (req, res) => {
  const companies = await User.find({ role: "company" })
    .select("name _id companyName")
    .lean();
  res.json(companies);
});

// @route   GET /api/auth/students - List students (for company offers)
router.get("/students", protect, restrictTo("company"), async (req, res) => {
  const students = await User.find({ role: "student" })
    .select("name email _id rollNumber collegeName")
    .lean();
  res.json(students);
});

module.exports = router;
