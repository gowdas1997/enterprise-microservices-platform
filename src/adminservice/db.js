const { Pool } = require("pg");
const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
});

let pool;

async function getSecret(secretName) {
  const client = new AWS.SecretsManager();

  const data = await client
    .getSecretValue({
      SecretId: secretName,
    })
    .promise();

  return JSON.parse(data.SecretString);
}

async function initializeDb() {
  try {
    const dbSecret = await getSecret(process.env.AWS_SECRET_NAME);

    pool = new Pool({
      host: dbSecret.HOST,
      port: parseInt(dbSecret.PORT, 10),
      database: dbSecret.DB_NAME,
      user: dbSecret.USER_NAME,
      password: dbSecret.PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

function getPool() {
  if (!pool) {
    throw new Error("Database not initialized");
  }
  return pool;
}

module.exports = {
  initializeDb,
  getPool,
  getSecret,
};