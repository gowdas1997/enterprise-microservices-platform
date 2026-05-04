const express = require("express");
const {
  register,
  login,
  verifyOtp,
} = require("../controllers/authController");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// 🔐 OTP verification
router.post("/verify-otp", verifyOtp);

module.exports = router;