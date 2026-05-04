const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail } = require("../models/userModel");
const { getSecret, getPool } = require("../db");

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function getJwtSecret() {
  const secretData = await getSecret(process.env.JWT_SECRET_NAME);
  return secretData.jwt_secret;
}

// ✅ Register user (with OTP)
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const pool = getPool();

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, otp_code, otp_expiry)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email`,
      [name, email, passwordHash, otp, otpExpiry]
    );

    console.log(`🔐 OTP for ${email}: ${otp}`);

    res.status(201).json({
      message: "User registered. Please verify OTP.",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
}

// ❗ Login only if verified
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email using OTP",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const jwtSecret = await getJwtSecret();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
}

// ✅ OTP Verification
async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const pool = getPool();

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (new Date() > user.otp_expiry) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           otp_code = NULL,
           otp_expiry = NULL
       WHERE email = $1`,
      [email]
    );

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
}

// ✅ FINAL EXPORT (must be at bottom)
module.exports = {
  register,
  login,
  verifyOtp,
};