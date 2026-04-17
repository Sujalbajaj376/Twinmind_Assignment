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
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-blue-600">
          TwinMind Clone
        </h1>

        {/* ✅ EXPORT BUTTON */}
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* 🔵 LEFT */}
        <div className="bg-white p-4 rounded shadow flex flex-col">
          <MicRecorder onTranscript={setTranscript} />

          <div className="mt-4 border-t pt-3 overflow-y-auto h-[60vh]">
            <h2 className="font-semibold text-gray-700 mb-2">Transcript</h2>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {transcript || "Start speaking to see transcript..."}
            </p>
          </div>
        </div>

        {/* 🟡 MIDDLE */}
        <div className="bg-white p-4 rounded shadow overflow-y-auto h-[80vh]">
          <h2 className="font-semibold text-gray-700 mb-2">Suggestions</h2>

          <SuggestionsPanel
            transcript={transcript}
            onSuggestionClick={setSelectedSuggestion}
            suggestionsHistory={suggestionsHistory}            // ✅ NEW
            setSuggestionsHistory={setSuggestionsHistory}      // ✅ NEW
          />
        </div>

        {/* 🟢 RIGHT */}
        <div className="bg-white p-4 rounded shadow h-[80vh]">
          <ChatPanel
            selectedSuggestion={selectedSuggestion}
            transcript={transcript}
            chatHistory={chatHistory}              // ✅ NEW
            setChatHistory={setChatHistory}        // ✅ NEW
          />
        </div>

      </div>
    </div>
  );
}

export default App;