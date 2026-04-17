import React, { useState, useEffect, useRef } from 'react';

const SuggestionsPanel = ({ 
  transcript, 
  onSuggestionClick, 
  suggestionsHistory, 
  setSuggestionsHistory 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastTranscript, setLastTranscript] = useState("");

  const latestTranscript = useRef(transcript);
  const lastCallTimeRef = useRef(0); // ✅ cooldown control

  useEffect(() => {
    latestTranscript.current = transcript;
  }, [transcript]);

  // Fetch suggestions
  const fetchSuggestions = async () => {
    if (!latestTranscript.current) return;

    setLoading(true);
    setError('');

    console.log("📡 Calling suggestions API with:", latestTranscript.current);

    try {
      const res = await fetch('https://twinmind-backend-dncc.onrender.com/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: latestTranscript.current }),
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data.suggestions)) {
        setSuggestionsHistory(prev =>
          [data.suggestions, ...prev].slice(0, 5) // keep last 5 batches
        );
      } else {
        setError(data.error || 'Failed to get suggestions');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SMART TRIGGER (FINAL)
  useEffect(() => {
    if (!transcript) return;

    // 1. Ignore same transcript
    if (transcript === lastTranscript) return;

    // 2. Ignore small changes (noise / repeat)
    const diff = transcript.length - lastTranscript.length;
    if (diff < 25) return;

    // 3. Cooldown (avoid spam calls)
    const now = Date.now();
    if (now - lastCallTimeRef.current < 8000) return;

    console.log("🔥 Smart update → fetching suggestions");

    lastCallTimeRef.current = now;
    setLastTranscript(transcript);

    fetchSuggestions();

  }, [transcript]);

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">

      {/* Refresh Button */}
      <div className="flex justify-center mb-3">
        <button
          onClick={fetchSuggestions}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Suggestions"}
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 mb-2">
        Updates intelligently while you speak
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <div className="mt-6 space-y-6">
        {suggestionsHistory.map((batch, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            
            <div className="font-semibold text-gray-700 mb-2">
              Batch {suggestionsHistory.length - i}
            </div>

            <ul className="space-y-2">
              {batch.map((suggestion, j) => (
                <li key={j}>
                  <button
                    className="w-full text-left bg-gray-50 rounded px-3 py-2 border border-gray-100 text-gray-800 shadow-sm hover:bg-blue-100 transition"
                    onClick={() => onSuggestionClick?.(suggestion)}
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>

          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-400 text-sm mt-2">
          Loading suggestions...
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;