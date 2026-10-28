
const test = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("../server");

test("CampusCare health endpoint returns healthy status", async () => {
  const server = createServer();

  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/health`
    );

    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.status, "healthy");
    assert.equal(data.application, "CampusCare");
  } finally {
    await new Promise((resolve, reject) =>
      server.close(error => error ? reject(error) : resolve())
    );
  }
});

test("CampusCare homepage responds successfully", async () => {
  const server = createServer();

  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/`
    );

    assert.equal(response.status, 200);
    assert.match(await response.text(), /CampusCare/);
  } finally {
    await new Promise((resolve, reject) =>
      server.close(error => error ? reject(error) : resolve())
    );
  }
});
