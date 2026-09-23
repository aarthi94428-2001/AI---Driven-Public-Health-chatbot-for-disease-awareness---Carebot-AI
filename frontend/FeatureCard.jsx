import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, description, icon, color, index }) => {
  const colorMap = {
    'care-blue': 'from-care-blue/20 to-care-blue/5 border-care-blue/30 text-care-blue',
    'care-purple': 'from-care-purple/20 to-care-purple/5 border-care-purple/30 text-care-purple',
    'care-pink': 'from-care-pink/20 to-care-pink/5 border-care-pink/30 text-care-pink',
  };

  const shadowMap = {
    'care-blue': 'group-hover:shadow-soft-blue',
    'care-purple': 'group-hover:shadow-soft-purple',
    'care-pink': 'group-hover:shadow-soft-pink',
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group h-full bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 transition-all duration-300 ${shadowMap[color] || 'group-hover:shadow-xl'}`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-3xl mb-6 shadow-inner`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-care-gray text-sm leading-relaxed group-hover:text-care-text transition-colors">
        {description}
      </p>
      <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        <span className={color.replace('care-', 'text-care-')}>Explore Feature</span>
        <span className={`ml-2 transform translate-x-0 group-hover:translate-x-2 transition-transform ${color.replace('care-', 'text-care-')}`}>→</span>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
