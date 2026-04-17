import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { question, transcript } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a smart AI assistant in a meeting. Give clear, concise, actionable answers.",
          },
          {
            role: "user",
            content: `Context: ${transcript}\n\nQuestion: ${question}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json", // ✅ FIX
        },
      }
    );

    res.json({
      answer: response.data.choices[0].message.content,
    });

  } catch (err) {
    console.error("CHAT ERROR:", err.response?.data || err.message);
    res.status(500).json({
      error: "Chat failed",
      details: err.response?.data || err.message
    });
  }
});

export default router;