
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();
const connectDB = require("./config/db");   
const frontendPath = path.join(__dirname, "client", "dist");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function createServer() {
  return http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;

    if (pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        status: "healthy",
        application: "CampusCare"
      }));
    }

    // Serve React's built frontend.
    const requestedPath =
      pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");

    const safePath = path.resolve(frontendPath, requestedPath);

    if (
      safePath.startsWith(frontendPath + path.sep) ||
      safePath === path.join(frontendPath, "index.html")
    ) {
      if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
        const contentType =
          mimeTypes[path.extname(safePath).toLowerCase()] ||
          "application/octet-stream";

        res.writeHead(200, { "Content-Type": contentType });
        return fs.createReadStream(safePath).pipe(res);
      }
    }

    // Allow React client-side routes to load.
    if (!path.extname(pathname) && fs.existsSync(path.join(frontendPath, "index.html"))) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return fs.createReadStream(path.join(frontendPath, "index.html")).pipe(res);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });
}


if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;

  connectDB()
    .then(() => {
      createServer().listen(port, "0.0.0.0", () => {
        console.log(`CampusCare running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start CampusCare:", error.message);
      process.exit(1);
    });
}


module.exports = { createServer };
