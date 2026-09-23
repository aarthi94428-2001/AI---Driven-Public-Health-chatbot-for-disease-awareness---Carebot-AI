import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { getPreventionTips } from '../services/api';

const PreventionPage = () => {
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await getPreventionTips();
        setTips(res.data);
      } catch (err) {
        console.error("Failed to fetch prevention protocols:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTips();
  }, []);

  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-y-auto scrollbar-hide p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-5xl mx-auto w-full"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-care-blue">
              Prevention Protocols
            </h1>
            <p className="text-care-gray font-medium">Evidence-based guidelines for maintaining optimal health and preventing disease.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 col-span-full gap-4">
                <div className="w-10 h-10 border-2 border-care-blue/20 border-t-care-blue rounded-full animate-spin" />
                <p className="text-xs font-bold text-care-gray uppercase tracking-widest">Syncing Protocols...</p>
              </div>
            ) : tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl mb-6 border border-white/5 group-hover:scale-110 transition-transform`}>
                  {tip.icon}
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-care-blue transition-colors">{tip.title}</h2>
                <p className="text-sm text-care-gray leading-relaxed group-hover:text-care-text transition-colors">
                  {tip.description || tip.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 p-8 bg-gradient-to-r from-care-blue/10 to-care-purple/10 rounded-[2.5rem] border border-white/10 text-center"
          >
            <p className="text-sm text-care-gray font-medium italic">
              "Prevention is better than cure. These guidelines are based on international clinical standards for health maintenance."
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default PreventionPage;
