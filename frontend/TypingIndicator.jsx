// Frontend/src/components/TypingIndicator.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  const dotVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="flex items-center justify-start mb-4">
      <div className="bot-message max-w-3/4 p-3 rounded-lg shadow-md flex items-center space-x-1">
        <span className="text-gray-800 mr-2">Bot is typing</span>
        <motion.span
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={{ ...dotTransition, delay: 0 }}
          className="block w-2 h-2 bg-gray-600 rounded-full"
        />
        <motion.span
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={{ ...dotTransition, delay: 0.1 }}
          className="block w-2 h-2 bg-gray-600 rounded-full"
        />
        <motion.span
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={{ ...dotTransition, delay: 0.2 }}
          className="block w-2 h-2 bg-gray-600 rounded-full"
        />
      </div>
    </div>
  );
};

export default TypingIndicator;