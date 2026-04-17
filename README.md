# 🚀 TwinMind Clone – Real-Time AI Meeting Assistant

## 🧠 Overview
TwinMind Clone is a real-time AI-powered meeting assistant that listens to live conversations, transcribes speech, and generates intelligent suggestions to help users respond effectively during discussions.

Built with a focus on **real-time interaction**, **context awareness**, and **clean UX**, this project simulates how modern AI copilots assist in meetings.

---

## ✨ Key Features

### 🎤 Continuous Voice Recording
- Single-click recording
- Automatically captures audio in chunks (~10s)
- No need to manually stop/start

### 📝 Real-Time Transcription
- Powered by **Groq Whisper**
- Transcript updates continuously as you speak
- Maintains full conversation context

### 💡 Smart Suggestions (AI)
- Generates **3 suggestions per batch**
  - 1 Question
  - 1 Action
  - 1 Insight
- Context-aware (based on full transcript)
- Intelligent filtering (no spam updates)

### ⚡ Smart Auto-Updates
- Suggestions update only when:
  - Meaningful new content is detected
  - Cooldown prevents excessive API calls
- Mimics real-world AI assistant behavior

### 💬 Interactive Chat Panel
- Click any suggestion → get AI response
- Manual question input supported
- Context-aware answers using full transcript

### 📦 Export Session
- Download complete session:
  - Transcript
  - Suggestions history
  - Chat history

### 🎨 Clean UI
- 3-column layout:
  - Transcript
  - Suggestions
  - Chat
- Built with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS

### Backend
- Node.js
- Express

### AI APIs
- Groq Whisper (Speech-to-Text)
- Groq LLM (Suggestions + Chat)

---

## ⚙️ How It Works

1. User starts recording
2. Audio is captured in chunks (~10 seconds)
3. Each chunk is sent to backend
4. Whisper transcribes audio → text
5. Transcript is appended
6. Suggestions API generates AI insights
7. UI updates intelligently (no spam)
8. User can interact via chat

---

## 📂 Project Structure
