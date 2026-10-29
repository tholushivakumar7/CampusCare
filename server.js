const express = require("express");
const path = require("node:path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const { authenticateToken } = require("./middleware/auth");

const app = express();
const frontendPath = path.join(__dirname, "client", "dist");

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    application: "CampusCare"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user
  });
});

// Serve React frontend
app.use(express.static(frontendPath));

app.get("/{*path}", (req, res, next) => {
  res.sendFile(path.join(frontendPath, "index.html"), (error) => {
    if (error) next(error);
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

async function startServer() {
  try {
    await connectDB();

    const port = Number(process.env.PORT) || 3000;

    app.listen(port, "0.0.0.0", () => {
      console.log(`CampusCare running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start CampusCare:", error.message);
    process.exit(1);
  }
}

const http = require("node:http");

function createServer() {
  return http.createServer(app);
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
  createServer
};