const { getPool } = require("../db");

// Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    const pool = getPool();

    const result = await pool.query(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC`
    );

    res.status(200).json({
      users: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}

// Promote user to admin
async function makeAdmin(req, res) {
  try {
    const { userId } = req.body;

    const pool = getPool();

    await pool.query(
      `UPDATE users SET role = 'admin' WHERE id = $1`,
      [userId]
    );

    res.status(200).json({
      message: "User promoted to admin",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update role",
      error: error.message,
    });
  }
}

module.exports = {
  getAllUsers,
  makeAdmin,
};