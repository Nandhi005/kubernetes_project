const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const client = redis.createClient({
  url: "redis://redis-service:6379"
});

client.connect();

// 🔥 Visitor Counter
app.get("/count", async (req, res) => {
  const count = await client.incr("visitor_count");
  res.json({ visitors: count });
});

// 🔥 Personalized Greeting (stored in Redis)
app.post("/greet", async (req, res) => {
  const { name } = req.body;

  await client.set(`user:${name}`, `Hello ${name}, welcome!`);
  const message = await client.get(`user:${name}`);

  res.json({ message });
});

// 🔥 Cached API (simulate heavy operation)
app.get("/data", async (req, res) => {
  const cached = await client.get("data_cache");

  if (cached) {
    return res.json({
      source: "cache",
      data: cached
    });
  }

  // simulate delay
  await new Promise(r => setTimeout(r, 2000));

  const data = "🚀 Fresh data from backend";
  await client.setEx("data_cache", 30, data);

  res.json({
    source: "backend",
    data
  });
});

// 🔥 Reset cache
app.get("/reset", async (req, res) => {
  await client.del("data_cache");
  res.send("Cache cleared");
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
