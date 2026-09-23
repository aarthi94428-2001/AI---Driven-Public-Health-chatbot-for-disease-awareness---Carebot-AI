// Frontend/src/hooks/useSpeechSynthesis.js
import { useState, useEffect, useRef } from 'react';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn("Text-to-Speech not supported in this browser.");
      return;
    }

    return () => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if (!synthRef.current) return;

    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utteranceRef.current.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utteranceRef.current);
  };

  const pause = () => {
    if (synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return { isSpeaking, isPaused, speak, pause, resume, stop };
};

export default useSpeechSynthesis;