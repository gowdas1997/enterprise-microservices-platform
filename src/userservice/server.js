const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { initializeDb } = require("./db");
const userRoutes = require("./routes/user");

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
    service: "userservice",
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Enterprise User Service Running",
  });
});

// User routes
app.use("/user", userRoutes);

// Start server
const PORT = process.env.PORT || 50052;

async function startServer() {
  try {
    await initializeDb();

    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start user service:", error.message);
    process.exit(1);
  }
}

startServer();