const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { initializeDb } = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "authservice",
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Enterprise Auth Service Running",
  });
});

// Auth routes
app.use("/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 50051;

async function startServer() {
  try {
    await initializeDb();

    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start auth service:", error.message);
    process.exit(1);
  }
}

startServer();