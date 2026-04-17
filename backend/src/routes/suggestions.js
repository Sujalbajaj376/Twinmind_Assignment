import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/suggestions', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    console.log("🧠 Transcript:", transcript);

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `
You are a real-time meeting assistant.

Generate EXACTLY 3 suggestions.

STRICT RULES:
- Output ONLY 3 lines
- NO numbering
- NO bullet points
- NO explanations
- Each must be under 10 words

Types:
1. One question
2. One action
3. One insight

Make them specific to the conversation.
`
          },
          {
            role: 'user',
            content: transcript
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data.choices[0]?.message?.content || "";

    console.log("🤖 Raw response:", text);

    let suggestions = text
      .split("\n")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Clean unwanted formats
    suggestions = suggestions.map(s =>
      s.replace(/^[-*\d.\s]+/, '').trim()
    );

    // Filter bad outputs
    suggestions = suggestions.filter(s =>
      !s.includes("**") &&
      s.length > 3 &&
      s.length < 80
    );

    // Ensure exactly 3
    if (suggestions.length < 3) {
      suggestions = [
        `What is the goal of "${transcript.slice(0, 20)}"?`,
        "What action should we take next?",
        "Do we have data to support this?"
      ];
    } else {
      suggestions = suggestions.slice(0, 3);
    }

    console.log("✅ Final suggestions:", suggestions);

    res.json({ suggestions });

  } catch (error) {
    console.error("❌ Groq API error:", error.response?.data || error.message);

    res.status(500).json({
      error: 'Failed to get suggestions',
      details: error.response?.data?.error || error.message
    });
  }
});

export default router;