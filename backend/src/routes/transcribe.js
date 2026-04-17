import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const router = Router();
const upload = multer();

router.post('/transcribe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('🔥 File received:', req.file.mimetype);
    console.log("📦 File size:", req.file.size);

    const formData = new FormData();

    // ✅ Use actual format (more stable)
    formData.append('file', req.file.buffer, {
      filename: 'audio.webm',
      contentType: req.file.mimetype,
    });

    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'en');

    console.log("🚀 Calling Groq API...");

    const response = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          ...formData.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
      }
    );

    console.log('✅ Groq response:', response.data);

    if (!response.data.text) {
      return res.json({ text: "" });
    }

    res.json({ text: response.data.text });

  } catch (error) {
    console.error('❌ ERROR:', error.response?.data || error.message);

    res.status(500).json({
      error: 'Transcription failed',
      details: error.response?.data || error.message
    });
  }
});

export default router;