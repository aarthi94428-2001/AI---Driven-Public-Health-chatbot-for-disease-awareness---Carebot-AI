import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { getPublicUpdates } from '../services/api';

const PublicUpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await getPublicUpdates();
        setUpdates(res.data);
      } catch (err) {
        console.error("Failed to fetch clinical updates:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-y-auto scrollbar-hide p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-4xl mx-auto w-full"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-care-blue">
              Clinical Bulletins
            </h1>
            <p className="text-care-gray font-medium">Official updates on platform features, clinical alerts, and health advisories.</p>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-2 border-care-blue/20 border-t-care-blue rounded-full animate-spin" />
                <p className="text-xs font-bold text-care-gray uppercase tracking-widest">Syncing Bulletins...</p>
              </div>
            ) : updates.map((update, index) => {
              const isAlert = update.type === 'alert';
              const isTip = update.type === 'tip';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  className={`p-8 rounded-[2rem] border transition-all duration-300 ${
                    isAlert 
                      ? 'border-red-500/30 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                      : isTip
                        ? 'border-care-purple/30 bg-care-purple/5 shadow-soft-purple'
                        : 'border-care-blue/30 bg-care-blue/5 shadow-soft-blue'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        isAlert ? 'bg-red-500/20' : isTip ? 'bg-care-purple/20' : 'bg-care-blue/20'
                      }`}>
                        {isAlert ? '🚨' : isTip ? '💡' : '📢'}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${
                          isAlert ? 'text-red-400' : isTip ? 'text-care-purple' : 'text-care-blue'
                        }`}>
                          {update.title}
                        </h3>
                        <p className="text-[10px] text-care-gray font-bold uppercase tracking-widest mt-1">
                          Bulletin Issued: {new Date(update.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                      isAlert ? 'border-red-500/30 text-red-400' : 'border-white/10 text-care-gray'
                    }`}>
                      {update.type}
                    </div>
                  </div>
                  
                  <p className="text-care-text leading-relaxed pl-16 opacity-80 group-hover:opacity-100 transition-opacity">
                    {update.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-20 flex justify-center">
            <p className="text-[10px] text-care-gray font-bold uppercase tracking-[0.5em] opacity-30">
              Verified Clinical Updates
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicUpdatesPage;
