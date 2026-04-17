import React, { useState, useRef } from 'react';

const MicRecorder = ({ onTranscript }) => {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);
  const [fullTranscript, setFullTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // ✅ FIX: use ref instead of state inside async
  const recordingRef = useRef(false);

  const startRecordingChunk = () => {
    if (!streamRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstart = () => setStatus('Recording...');

    mediaRecorder.onstop = async () => {
      setStatus('Processing...');
      setLoading(true);

      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      try {
        const res = await fetch('https://twinmind-backend-dncc.onrender.com/api/transcribe/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.text) {
          setFullTranscript(prev => {
            const updated = prev + " " + data.text;
            if (onTranscript) setTimeout(() => onTranscript(updated), 0);
            return updated;
          });

          setStatus('Transcript updated');
        } else {
          setStatus('No speech detected');
        }

      } catch (err) {
        setStatus('Transcription failed');
      }

      setLoading(false);

      // ✅ FIXED: use ref instead of state
      if (recordingRef.current) {
        startRecordingChunk();
      }
    };

    mediaRecorder.start();

    // ⏱️ stop after 10 sec
    setTimeout(() => {
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    }, 10000);
  };

  const handleStart = async () => {
    setStatus('Requesting microphone...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setRecording(true);
      recordingRef.current = true; // ✅ important

      startRecordingChunk();

    } catch (err) {
      setStatus('Microphone access denied');
      setRecording(false);
      recordingRef.current = false;
    }
  };

  const handleStop = () => {
    setRecording(false);
    recordingRef.current = false; // ✅ important

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setStatus('Stopped');
  };

  return (
    <div className="w-full max-w-xl bg-white p-4 rounded shadow border">

      <div className="flex flex-col items-center gap-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={recording ? handleStop : handleStart}
          disabled={loading}
        >
          {loading
            ? 'Processing...'
            : recording
              ? 'Stop Recording'
              : 'Start Recording'}
        </button>

        <span className="text-gray-600 text-sm">{status}</span>
      </div>

      <div className="mt-4 max-h-40 overflow-y-auto text-sm text-gray-800 border-t pt-3">
        <strong>Transcript:</strong>
        <p className="mt-1 whitespace-pre-wrap">
          {fullTranscript || "Start speaking to see transcript..."}
        </p>
      </div>

    </div>
  );
};

export default MicRecorder;