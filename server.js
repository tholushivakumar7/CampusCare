
const http = require("node:http");

function createServer() {
  return http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        status: "healthy",
        application: "CampusCare"
      }));
    }

    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CampusCare</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f1f5f9;
      color: #172554;
    }
    header {
      background: #123b63;
      color: white;
      padding: 24px 8%;
    }
    main {
      max-width: 850px;
      margin: 40px auto;
      padding: 20px;
    }
    section {
      background: white;
      padding: 28px;
      border-radius: 14px;
    }
    .status {
      color: #15803d;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <header>
    <h1>CampusCare</h1>
    <p>Smart Campus Maintenance System</p>
  </header>
  <main>
    <section>
      <h2>Welcome to CampusCare</h2>
      <p>A better way to manage campus maintenance problems.</p>
      <p>Report water leakage, electrical faults, broken fans and damaged furniture.</p>
      <p class="status">Application is running successfully.</p>
      <p>Version 1.0.0 | Automated CI/CD deployment</p>
    </section>
  </main>
</body>
</html>`);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;

  createServer().listen(port, "0.0.0.0", () => {
    console.log(`CampusCare running on port ${port}`);
  });
}

module.exports = { createServer };
