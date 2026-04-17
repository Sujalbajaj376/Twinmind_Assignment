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
      const res = await fetch('https://twinmind-backend-dncc.onrender.com/api/suggestions/suggestions', {
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
    <div className="max-w-xl mx-auto mt-4 p-0">
      <div className="rounded-2xl bg-gradient-to-br from-yellow-50 via-white to-pink-50 shadow-xl border border-yellow-100 p-6 animate-fadein">
        {/* Refresh Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={fetchSuggestions}
            className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-500 hover:to-purple-600 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>Refreshing...</span>
            ) : (
              <span className="flex items-center gap-2"><span className="text-lg">💡</span>Refresh Suggestions</span>
            )}
          </button>
        </div>

        <div className="text-center text-xs text-gray-400 mb-2">
          Updates intelligently while you speak
        </div>

        {error && <div className="text-red-500 mt-2">{error}</div>}

        <div className="mt-6 space-y-6">
          {suggestionsHistory.length === 0 && !loading && (
            <div className="text-center text-gray-400 text-base py-8">
              <span className="text-3xl block mb-2">✨</span>
              Suggestions will appear here as you speak.
            </div>
          )}
          {suggestionsHistory.map((batch, i) => (
            <div key={i} className="bg-white/90 rounded-xl shadow border border-gray-100 p-4 transition-all duration-200 hover:shadow-lg">
              <div className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                Batch {suggestionsHistory.length - i}
              </div>
              <ul className="space-y-2">
                {batch.map((suggestion, j) => (
                  <li key={j}>
                    <button
                      className="w-full text-left bg-gradient-to-r from-yellow-50 to-pink-50 rounded px-3 py-2 border border-gray-200 text-gray-800 shadow-sm hover:bg-yellow-100 hover:scale-[1.02] transition-all duration-150"
                      onClick={() => onSuggestionClick?.(suggestion)}
                    >
                      <span className="mr-2 text-yellow-500">⭐</span>{suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center text-gray-400 text-sm mt-2 flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>
            Loading suggestions...
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionsPanel;