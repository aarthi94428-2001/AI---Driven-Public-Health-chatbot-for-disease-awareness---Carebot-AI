import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { getVaccinations, updateVaccinationStatus, getPreventionTips } from '../services/api';

const VaccinationAwarenessPage = () => {
  const [vaccines, setVaccines] = useState([]);
  const [preventionTips, setPreventionTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    age: 25,
    gender: 'Other',
    conditions: ''
  });
  const [activeTab, setActiveTab] = useState('schedule'); // schedule, prevention

  useEffect(() => {
    fetchVaccineData();
    fetchPreventionTips();
  }, [userProfile.age]);

  const fetchVaccineData = async () => {
    try {
      setLoading(true);
      const res = await getVaccinations(userProfile.age);
      setVaccines(res.data || []);
    } catch (err) {
      console.error("Failed to fetch vaccines:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreventionTips = async () => {
    try {
      const res = await getPreventionTips();
      setPreventionTips(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tips:", err);
    }
  };

  const handleStatusUpdate = async (vaccineId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await updateVaccinationStatus({ vaccineId, status: newStatus });
      setVaccines(prev => prev.map(v => v.id === vaccineId ? { ...v, status: newStatus } : v));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const progress = useMemo(() => {
    if (vaccines.length === 0) return 0;
    const completed = vaccines.filter(v => v.status === 'Completed').length;
    return Math.round((completed / vaccines.length) * 100);
  }, [vaccines]);

  return (
    <div className="flex h-screen bg-[#020617] text-white p-6 gap-6 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Header & User Profile */}
        <div className="p-12 pb-8 border-b border-white/5 relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-care-blue to-care-purple tracking-tighter mb-4">
                Vaccination & Prevention
              </h1>
              <p className="text-care-gray text-sm font-medium opacity-80">
                Personalized immunization schedule and clinical prevention protocols.
              </p>
            </div>
            
            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-3xl border border-white/10">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-care-blue uppercase tracking-widest">Age</label>
                <input 
                  type="number" 
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                  className="w-16 bg-transparent text-xl font-black focus:outline-none"
                />
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-care-purple uppercase tracking-widest">Progress</label>
                <p className="text-xl font-black">{progress}%</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-care-blue text-[#020617]' : 'bg-white/5 text-care-gray hover:bg-white/10'}`}
            >
              💉 Smart Schedule
            </button>
            <button 
              onClick={() => setActiveTab('prevention')}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'prevention' ? 'bg-care-purple text-white' : 'bg-white/5 text-care-gray hover:bg-white/10'}`}
            >
              🛡️ Prevention Tips
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 pt-8 scrollbar-hide relative z-10">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                  <div className="w-16 h-16 border-4 border-care-blue/10 border-t-care-blue rounded-full animate-spin"></div>
                  <p className="text-care-gray font-black uppercase tracking-[0.3em] text-[10px]">Analyzing Health Profile</p>
                </div>
              ) : activeTab === 'schedule' ? (
                <div className="space-y-8">
                  {vaccines.some(v => v.status === 'Pending') && (
                    <div className="p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center gap-4 animate-pulse">
                      <span className="text-2xl">⚠️</span>
                      <p className="text-sm font-black text-red-400 uppercase tracking-widest">Your vaccine is due soon!</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vaccines.map((v, i) => (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-8 rounded-[2.5rem] bg-white/[0.03] border transition-all group ${v.status === 'Completed' ? 'border-green-500/30' : 'border-white/10'}`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${v.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-care-blue/20 text-care-blue'}`}>
                            {v.status === 'Completed' ? '✅' : '💉'}
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-care-gray uppercase tracking-widest mb-1">Due Date</p>
                            <p className={`text-xs font-black ${v.status === 'Pending' ? 'text-care-blue' : 'text-care-gray'}`}>{v.dueDate}</p>
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2">{v.name}</h3>
                        <p className="text-xs font-bold text-care-gray uppercase tracking-widest mb-4">{v.purpose}</p>
                        
                        <div className="space-y-4 mb-8">
                          <div className="flex gap-3 text-xs">
                            <span className="text-care-blue">⚖️</span>
                            <span className="text-white/60"><strong className="text-white/80">Dosage:</strong> {v.dosage}</span>
                          </div>
                          <div className="flex gap-3 text-xs">
                            <span className="text-care-purple">🧬</span>
                            <span className="text-white/60"><strong className="text-white/80">Benefits:</strong> {v.benefits}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleStatusUpdate(v.id, v.status)}
                          className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${v.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-care-blue text-[#020617]'}`}
                        >
                          {v.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {preventionTips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group"
                    >
                      <div className="text-4xl mb-6">{tip.icon}</div>
                      <h3 className="text-xl font-black text-white mb-3">{tip.title}</h3>
                      <p className="text-sm text-care-gray leading-relaxed font-medium">{tip.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>
    </div>
  );
};

export default VaccinationAwarenessPage;