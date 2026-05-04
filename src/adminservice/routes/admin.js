const express = require("express");
const { authenticateAdmin } = require("../middleware/authMiddleware");

const {
  getAllUsers,
  makeAdmin,
} = require("../controllers/adminController");

const router = express.Router();

// Admin-only routes
router.get("/users", authenticateAdmin, getAllUsers);
router.post("/make-admin", authenticateAdmin, makeAdmin);

module.exports = router;