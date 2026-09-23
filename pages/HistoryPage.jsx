import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { getChatHistory, deleteHistoryItem, clearAllHistory } from '../services/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); 
  const [dayFilter, setDayFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const historyEndRef = useRef(null);

  const getBotSummary = (botResponse) => {
    if (!botResponse) return '';
    if (typeof botResponse === 'string') return botResponse;
    if (botResponse.reply) return botResponse.reply;
    if (botResponse.description) return botResponse.description;
    if (botResponse.definition) return botResponse.definition;
    return JSON.stringify(botResponse);
  };

  const formatList = (value) => {
    if (!value) return '';
    if (Array.isArray(value)) return value.filter(Boolean).join(', ');
    return String(value);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getChatHistory();
      const data = res.data || [];
      setHistory(data);
      // Store in localStorage as backup
      localStorage.setItem('carebot_history_backup', JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch history:", err);
      // Load from backup if API fails
      const backup = localStorage.getItem('carebot_history_backup');
      if (backup) setHistory(JSON.parse(backup));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllHistory();
      setHistory([]);
      setShowConfirmClear(false);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = 
        (item.user_query && item.user_query.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.topic && item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const itemDate = new Date(item.timestamp);
      const now = new Date();
      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = itemDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        matchesDate = itemDate.toDateString() === yesterday.toDateString();
      }

      const matchesDay = dayFilter === 'all' || (item.day && item.day.toLowerCase() === dayFilter.toLowerCase());

      return matchesSearch && matchesDate && matchesDay;
    });
  }, [history, searchQuery, dateFilter, dayFilter]);

  const groupedHistory = useMemo(() => {
    const groups = {
      Today: [],
      Yesterday: [],
      Older: []
    };

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    filteredHistory.forEach(item => {
      const itemDate = new Date(item.timestamp);
      if (itemDate.toDateString() === now.toDateString()) {
        groups.Today.push(item);
      } else if (itemDate.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(item);
      } else {
        groups.Older.push(item);
      }
    });

    return groups;
  }, [filteredHistory]);

  return (
    <div className="flex h-screen bg-[#020617] text-white p-6 gap-6 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        {/* Header */}
        <div className="p-12 pb-8 border-b border-white/5 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-care-blue to-care-purple tracking-tighter mb-4">
                Chat History
              </h1>
              <p className="text-care-gray text-sm font-medium opacity-80">
                Complete archive of your clinical AI interactions with precise time-stamping.
              </p>
            </div>
            <button 
              onClick={() => setShowConfirmClear(true)}
              className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 shadow-lg shadow-red-500/5"
            >
              Clear All History
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-6 items-center bg-white/[0.02] p-4 rounded-[2rem] border border-white/5">
            <div className="flex-1 min-w-[300px] relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-care-gray">🔍</span>
              <input 
                type="text" 
                placeholder="Search history by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-sm font-medium focus:outline-none focus:border-care-blue/40 transition-all"
              />
            </div>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-care-blue/40 transition-all"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
            </select>
            <select 
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-care-blue/40 transition-all"
            >
              <option value="all">All Days</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-12 pt-8 scrollbar-hide relative z-10">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="w-16 h-16 border-4 border-care-blue/10 border-t-care-blue rounded-full animate-spin"></div>
                <p className="text-care-gray font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Records</p>
              </div>
            ) : history.length > 0 ? (
              Object.entries(groupedHistory).map(([group, items]) => items.length > 0 && (
                <div key={group} className="mb-12">
                  <h2 className="text-[10px] font-black text-care-blue uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-care-blue/20"></span>
                    {group}
                    <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-care-blue/20"></span>
                  </h2>
                  <div className="space-y-8">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative pl-12 group"
                      >
                        {/* Timeline Marker */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 group-hover:bg-care-blue/20 transition-colors"></div>
                        <div className="absolute left-[-4px] top-10 w-2.5 h-2.5 rounded-full bg-white/10 border-2 border-[#020617] group-hover:bg-care-blue group-hover:shadow-[0_0_10px_rgba(63,208,255,0.5)] transition-all"></div>

                        <div className={`p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all duration-500 shadow-xl ${expandedId === item.id ? 'ring-2 ring-care-blue/20' : ''}`}>
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-black text-care-gray uppercase tracking-widest">{item.date}</span>
                              <span className="text-xs font-bold text-care-blue/60">{item.day}</span>
                              <span className="text-xs font-black text-care-purple/60">{item.time}</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/5 text-red-400/40 hover:bg-red-500/20 hover:text-red-400 transition-all">🗑️</button>
                              <button 
                                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedId === item.id ? 'bg-care-blue/20 text-care-blue rotate-180' : 'bg-white/5 text-care-gray'}`}
                              >
                                ▼
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                              <p className="text-[10px] text-care-gray font-black uppercase tracking-widest mb-2 opacity-40">User Inquiry</p>
                              <p className="text-white/80 italic font-medium">"{item.user_query}"</p>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-care-blue/5 border border-care-blue/10">
                              <p className="text-[10px] text-care-blue font-black uppercase tracking-widest mb-2 opacity-60">AI Clinical Response</p>
                              <p className="text-care-text text-sm leading-relaxed">
                                {getBotSummary(item.bot_response)}
                              </p>
                              
                              <AnimatePresence>
                                {expandedId === item.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-6 pt-6 border-t border-care-blue/10 space-y-4"
                                  >
                                    {(item.bot_response?.symptoms || item.bot_response?.causes || item.bot_response?.prevention) && (
                                      <div>
                                        <p className="text-[9px] font-black text-care-blue/60 uppercase mb-2">Symptoms</p>
                                        <p className="text-xs opacity-80">{formatList(item.bot_response.symptoms)}</p>
                                      </div>
                                    )}
                                    {(item.bot_response?.medical_treatments || item.bot_response?.treatment) && (
                                      <div>
                                        <p className="text-[9px] font-black text-care-purple/60 uppercase mb-2">Treatment</p>
                                        <p className="text-xs opacity-80">{formatList(item.bot_response.medical_treatments || item.bot_response.treatment)}</p>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-48 text-center opacity-20">
                <span className="text-8xl mb-8">📜</span>
                <h3 className="text-2xl font-black uppercase tracking-[0.2em]">Archive Empty</h3>
              </div>
            )}
            <div ref={historyEndRef} />
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showConfirmClear && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0F172A] border border-white/10 p-12 rounded-[3rem] max-w-md w-full text-center">
                <div className="text-5xl mb-6">⚠️</div>
                <h2 className="text-2xl font-black mb-4">Purge All Records?</h2>
                <p className="text-care-gray mb-10 leading-relaxed">This action is irreversible. All clinical interaction logs will be permanently deleted.</p>
                <div className="flex gap-4">
                  <button onClick={() => setShowConfirmClear(false)} className="flex-1 py-4 rounded-2xl bg-white/5 font-black text-xs uppercase tracking-widest">Abort</button>
                  <button onClick={handleClearAll} className="flex-1 py-4 rounded-2xl bg-red-500 font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20">Confirm Purge</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HistoryPage;
