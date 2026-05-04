const { getPool } = require("../db");

async function getUserProfile(userId) {
  const pool = getPool();

  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role,
            p.phone, p.address, p.city, p.state, p.country, p.postal_code
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.user_id
     WHERE u.id = $1`,
    [userId]
  );

  return result.rows[0];
}

async function createOrUpdateProfile(userId, profileData) {
  const pool = getPool();

  const {
    phone,
    address,
    city,
    state,
    country,
    postal_code,
  } = profileData;

  const result = await pool.query(
    `INSERT INTO user_profiles
     (user_id, phone, address, city, state, country, postal_code)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id)
     DO UPDATE SET
       phone = EXCLUDED.phone,
       address = EXCLUDED.address,
       city = EXCLUDED.city,
       state = EXCLUDED.state,
       country = EXCLUDED.country,
       postal_code = EXCLUDED.postal_code,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      userId,
      phone,
      address,
      city,
      state,
      country,
      postal_code,
    ]
  );

  return result.rows[0];
}

module.exports = {
  getUserProfile,
  createOrUpdateProfile,
};