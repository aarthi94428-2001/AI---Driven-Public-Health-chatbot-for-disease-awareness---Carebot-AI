import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import { sendMessageToAI } from '../services/api';
import Sidebar from '../components/Sidebar';
import ImageUploadSection from '../components/ImageUploadSection';
import useSpeechRecognition from '../components/useSpeechRecognition';

const ChatPage = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('carebot_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const { isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition(
    useCallback((finalTranscript) => {
      handleSendMessage(finalTranscript);
    }, [])
  );
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('carebot_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: {
            disease_name: "Welcome",
            description: "Hello! I am CareBot AI, your professional healthcare assistant. How can I help you today? (Disclaimer: This is not a substitute for professional medical advice. Always consult a doctor.)",
            causes: [], symptoms: [], prevention: [], home_remedies: [], medical_treatments: [], when_to_consult_doctor: "", emergency_warning_signs: [],
            severity: 'Mild',
            emergency: false,
          },
          type: 'structured',
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, []);

  const handleSendMessage = async (text, isImageAnalysis = false) => {
    const userMsg = {
      id: Date.now().toString(),
      text: { reply: text },
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);
    setInput('');

    try {
      const data = await sendMessageToAI(text);
      const botMsgContent = data;

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: botMsgContent,
        type: botMsgContent.reply ? 'text' : 'structured',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.response?.data?.detail || "⚠️ Connectivity issue. Please ensure the backend is active.");
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: { reply: "Sorry, I'm having trouble connecting right now. Please try again later.", severity: 'error' },
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Delete all clinical conversation history?")) {
      setMessages([]);
      localStorage.removeItem('carebot_history');
    }
  };

  const handleImageAnalysisResult = (result) => {
    const botMessage = {
      id: Date.now() + 1,
      text: result,
      type: 'image_analysis',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-care-blue/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-care-purple/5 blur-[120px] rounded-full -z-10" />

        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-md z-20"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-care-blue to-care-purple rounded-2xl p-[1px] shadow-soft-blue">
                <div className="w-full h-full bg-care-navy rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-care-gray">CB</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-care-navy shadow-[0_0_10px_#22c55e]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Clinical AI Assistant</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-care-gray font-bold uppercase tracking-widest">Secure Health Uplink</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={clearChat}
              className="flex items-center space-x-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border border-red-500/20 group transition-all"
            >
              <span className="text-lg group-hover:rotate-12 transition-transform">🧹</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Clear Chat</span>
            </button>
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
              <span className="text-xl">📞</span>
            </button>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto px-6 md:px-16 py-10 custom-scrollbar space-y-6 relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id}
                message={msg}
                sender={msg.sender}
                timestamp={msg.timestamp}
              />
            ))}
          </AnimatePresence>
          
          {isLoading && <TypingIndicator />}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                {error}
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-6 md:px-24 pb-6 pt-4 bg-gradient-to-t from-care-navy to-transparent z-20"
        >
          <ImageUploadSection
            onImageAnalysisResult={handleImageAnalysisResult}
            onLoadingChange={setIsLoading}
            onError={setError}
          />

          <div className="flex items-center space-x-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white shadow-md`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
              disabled={isLoading}
            >
              {isRecording ? '🔴' : '🎤'}
            </motion.button>
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white placeholder-gray-400"
              placeholder={isRecording ? "Listening..." : "Type your message..."}
              value={isRecording ? transcript || '' : input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage(input)}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage(input)}
              className="p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
              disabled={isLoading || !input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
          <p className="text-[10px] text-center text-care-gray mt-6 uppercase tracking-[0.3em] font-medium">
            Protected by Clinical AI Protocol v4.0 • HIPAA Compliant
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default ChatPage;
