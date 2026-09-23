// Frontend/src/components/ChatMessage.jsx
import React from 'react';
import { motion } from 'framer-motion'; // UI unchanged
import StructuredBotResponse from './StructuredBotResponse'; // New component for structured data

const ChatMessage = ({ message, sender, timestamp }) => {
  const isBot = sender === 'bot';
  const messageClass = isBot ? 'bot-message' : 'user-message';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-3/4 p-3 rounded-lg shadow-md ${messageClass}`}>
        {isBot && message.type === 'structured' ? (
          <StructuredBotResponse data={message.text} /> /* Pass structured data directly */
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">{message.text.reply || message.text}</p>
        )}
        <span className="block text-xs text-gray-500 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;