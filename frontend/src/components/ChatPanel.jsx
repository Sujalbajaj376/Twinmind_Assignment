import React, { useRef, useEffect, useState } from 'react';

const ChatPanel = ({ 
  selectedSuggestion, 
  transcript, 
  chatHistory, 
  setChatHistory 
}) => {
  const [loading, setLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  // 🔁 Common function
  const sendMessage = (question) => {
    if (!question) return;

    setLastQuestion(question);

    // Add user message
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: question }
    ]);

    setLoading(true);

    fetch('https://twinmind-backend-dncc.onrender.com/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, transcript }),
    })
      .then(res => res.json())
      .then(data => {
        setChatHistory(prev => [
          ...prev,
          {
            role: 'ai',
            content: data.answer || data.error || 'No response available.'
          }
        ]);
      })
      .catch(() => {
        setChatHistory(prev => [
          ...prev,
          { role: 'ai', content: 'Network error. Please try again.' }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // When suggestion clicked
  useEffect(() => {
    if (!selectedSuggestion) return;

    if (selectedSuggestion === lastQuestion) return;

    sendMessage(selectedSuggestion);

  }, [selectedSuggestion]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  return (
    <div className="w-full max-w-md h-[80vh] bg-white border-l border-gray-200 flex flex-col p-4 shadow-lg">

      <h2 className="text-lg font-semibold mb-4 text-gray-700">Chat</h2>

      <div className="flex-1 space-y-3 overflow-y-auto">

        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[75%] text-sm shadow
              ${msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Thinking...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatPanel;