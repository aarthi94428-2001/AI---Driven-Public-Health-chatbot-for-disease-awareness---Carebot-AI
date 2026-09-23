import React from 'react';
import { motion } from 'framer-motion';

const HospitalCard = ({ hospital, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      className="bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-care-blue/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
          🏥
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map(i => (
            <span key={i} className="text-[10px]">⭐</span>
          ))}
          <span className="text-[10px] text-care-gray opacity-50">⭐</span>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-care-blue transition-colors">{hospital.name}</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm text-care-gray">
          <span className="opacity-50">📍</span>
          <p className="line-clamp-1">{hospital.address}</p>
        </div>
        <div className="flex items-center space-x-3 text-sm text-care-gray font-mono">
          <span className="opacity-50">📞</span>
          <p>{hospital.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${hospital.phone}`} className="w-full">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
          >
            Call
          </motion.button>
        </a>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full"
        >
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(63, 208, 255, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-care-blue/20 hover:bg-care-blue/30 border border-care-blue/30 rounded-xl text-xs font-bold uppercase tracking-widest text-care-blue transition-all"
          >
            Directions
          </motion.button>
        </a>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
