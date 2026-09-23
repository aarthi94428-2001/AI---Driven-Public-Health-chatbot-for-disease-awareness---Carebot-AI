import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';

import { submitFeedback } from '../services/api';

const FeedbackPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitFeedback(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("⚠️ Clinical server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setFormData(prev => ({ ...prev, name: value }));
    if (name === 'email') setFormData(prev => ({ ...prev, email: value }));
    if (e.target.tagName === 'TEXTAREA') setFormData(prev => ({ ...prev, message: value }));
  };

  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-y-auto scrollbar-hide p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-2xl mx-auto w-full"
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-care-blue">
              Clinical Feedback
            </h1>
            <p className="text-care-gray font-medium">Your insights help us refine our healthcare AI protocols.</p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-center py-20 bg-white/5 rounded-[3rem] border border-care-blue/20 shadow-soft-blue"
              >
                <div className="text-6xl mb-6">✅</div>
                <h2 className="text-3xl text-care-blue font-bold mb-4">Feedback Received</h2>
                <p className="text-care-gray max-w-sm mx-auto">Thank you for contributing to the evolution of CareBot AI. Our engineering team will review your report.</p>
                <motion.button
                  onClick={() => setSubmitted(false)}
                  whileHover={{ scale: 1.05 }}
                  className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Send Another
                </motion.button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6 bg-white/[0.03] p-10 rounded-[3rem] border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-care-gray uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Smith" 
                      className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-care-gray/30 focus:outline-none focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-care-gray uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="clinical@example.com" 
                      className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-care-gray/30 focus:outline-none focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 transition-all" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-care-gray uppercase tracking-widest ml-2">Clinical Observations</label>
                  <textarea 
                    name="message"
                    placeholder="Describe your experience or suggest improvements..." 
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6" 
                    className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-care-gray/30 focus:outline-none focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 transition-all resize-none"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(63, 208, 255, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-care-blue to-care-purple rounded-2xl font-bold text-lg shadow-soft-blue transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing Clinical Data...' : 'Submit Clinical Report'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default FeedbackPage;
