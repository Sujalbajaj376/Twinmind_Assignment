
import React, { useState } from 'react';
import MicRecorder from './components/MicRecorder';
import SuggestionsPanel from './components/SuggestionsPanel';
import ChatPanel from './components/ChatPanel';

function App() {
  const [transcript, setTranscript] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState("");

  // ✅ NEW (for export)
  const [suggestionsHistory, setSuggestionsHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur shadow-md py-3 px-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow">🧠</span>
          <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">TwinMind</span>
        </div>
        <button
          onClick={() => {
            const data = {
              transcript,
              suggestionsHistory,
              chatHistory,
              timestamp: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "session.json";
            a.click();
          }}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-blue-600 transition"
        >
          Export Session
        </button>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-2 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 🔵 LEFT: Transcript & Recorder */}
          <section className="bg-white/90 rounded-2xl shadow-xl flex flex-col border border-blue-100 hover:shadow-2xl transition p-6">
            <MicRecorder onTranscript={setTranscript} />
            <div className="mt-6 border-t pt-4 overflow-y-auto h-[60vh]">
              <h2 className="font-bold text-blue-700 mb-2 text-lg flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-blue-400 rounded-full"></span> Transcript
              </h2>
              <p className="text-base text-gray-800 whitespace-pre-wrap min-h-[3rem]">
                {transcript || "Start speaking to see transcript..."}
              </p>
            </div>
          </section>

          {/* 🟡 MIDDLE: Suggestions */}
          <section className="bg-white/90 rounded-2xl shadow-xl border border-yellow-100 hover:shadow-2xl transition p-6 overflow-y-auto h-[80vh] flex flex-col">
            <h2 className="font-bold text-yellow-600 mb-2 text-lg flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full"></span> Suggestions
            </h2>
            <SuggestionsPanel
              transcript={transcript}
              onSuggestionClick={setSelectedSuggestion}
              suggestionsHistory={suggestionsHistory}
              setSuggestionsHistory={setSuggestionsHistory}
            />
          </section>

          {/* 🟢 RIGHT: Chat */}
          <section className="bg-white/90 rounded-2xl shadow-xl border border-green-100 hover:shadow-2xl transition p-6 h-[80vh] flex flex-col">
            <ChatPanel
              selectedSuggestion={selectedSuggestion}
              transcript={transcript}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;