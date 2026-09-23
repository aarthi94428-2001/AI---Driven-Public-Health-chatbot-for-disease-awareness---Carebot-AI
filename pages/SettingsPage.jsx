import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [theme] = useState('Clinical Dark');

  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-y-auto scrollbar-hide p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-2xl mx-auto w-full"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-care-blue">
              System Configuration
            </h1>
            <p className="text-care-gray font-medium">Manage your clinical interface and data privacy protocols.</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-care-gray uppercase tracking-[0.4em] mb-4 px-4">Interface Settings</h3>
            
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-care-blue/10 rounded-xl flex items-center justify-center text-xl shadow-inner">🔔</div>
                <div>
                  <p className="font-bold text-white">Clinical Notifications</p>
                  <p className="text-xs text-care-gray">Receive real-time health alerts and updates.</p>
                </div>
              </div>
              <motion.div 
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-care-blue' : 'bg-gray-700'}`}
                onClick={() => setNotifications(!notifications)}
              >
                <motion.div 
                  className="w-6 h-6 bg-white rounded-full shadow-md" 
                  layout 
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  animate={{ x: notifications ? 24 : 0 }}
                />
              </motion.div>
            </div>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-care-purple/10 rounded-xl flex items-center justify-center text-xl shadow-inner">🎨</div>
                <div>
                  <p className="font-bold text-white">Visual Protocol</p>
                  <p className="text-xs text-care-gray">Active theme for medical dashboard.</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-care-purple/20 text-care-purple rounded-xl border border-care-purple/30 font-bold text-xs uppercase tracking-widest">
                {theme}
              </div>
            </div>

            <h3 className="text-[10px] font-bold text-care-gray uppercase tracking-[0.4em] mt-12 mb-4 px-4">Privacy & Data</h3>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-care-pink/10 rounded-xl flex items-center justify-center text-xl shadow-inner">🛡️</div>
                <div>
                  <p className="font-bold text-white">Anonymous Data Sharing</p>
                  <p className="text-xs text-care-gray">Help improve clinical AI models anonymously.</p>
                </div>
              </div>
              <motion.div 
                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${dataSharing ? 'bg-care-pink' : 'bg-gray-700'}`}
                onClick={() => setDataSharing(!dataSharing)}
              >
                <motion.div 
                  className="w-6 h-6 bg-white rounded-full shadow-md" 
                  layout 
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  animate={{ x: dataSharing ? 24 : 0 }}
                />
              </motion.div>
            </div>

            <div className="bg-red-500/5 p-8 rounded-[2rem] border border-red-500/20 mt-12 text-center group transition-all">
              <h4 className="text-red-400 font-bold mb-2">Delete Clinical Archive</h4>
              <p className="text-xs text-care-gray mb-6">This action will permanently erase all your health logs and history.</p>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Wipe All Data
              </motion.button>
            </div>
          </div>
          
          <div className="mt-20 flex justify-center">
            <p className="text-[10px] text-care-gray font-bold uppercase tracking-[0.5em] opacity-30">
              CareBot AI System v4.0.2-Clinical
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
