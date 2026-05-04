const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { initializeDb } = require("./db");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "adminservice",
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Enterprise Admin Service Running",
  });
});

// Admin routes
app.use("/admin", adminRoutes);

// Start server
const PORT = process.env.PORT || 50053;

async function startServer() {
  try {
    await initializeDb();

    app.listen(PORT, () => {
      console.log(`Admin service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start admin service:", error.message);
    process.exit(1);
  }
}

startServer();