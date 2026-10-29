
const express = require("express");
const path = require("node:path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
const frontendPath = path.join(__dirname, "client", "dist");

// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// Health check for Jenkins and deployment monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    application: "CampusCare"
  });
});

// Registration and login APIs
app.use("/api/auth", authRoutes);
const { authenticateToken } = require("./middleware/auth");

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user
  });
});
// Serve the React frontend
app.use(express.static(frontendPath));

// Allow React client-side routes to load
app.get("/{*path}", (req, res, next) => {
  res.sendFile(path.join(frontendPath, "index.html"), (error) => {
    if (error) next(error);
  });
});

// Handle unknown API routes
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

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
