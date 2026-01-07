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
const CHAT_ID = "8522367236";

app.get("/", (req, res) => {
  res.send("Backend alive");
});

/**
 * ✅ EXACT SIMPLE ROUTE (IMAGE ONLY)
 * This is the version that works.
 */
app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    console.log("HIT /submit");
    console.log("FILE:", req.file && req.file.size);

    if (!req.file) {
      return res.status(400).send("No file");
    }

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", req.file.buffer, {
      filename: "photo.jpg",
      contentType: "image/jpeg"
    });

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    res.send("OK");
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("FAIL");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
