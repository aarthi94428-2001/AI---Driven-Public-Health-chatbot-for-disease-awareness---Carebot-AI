import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-care-blue/10 blur-[120px] rounded-full -z-10 animate-pulse-soft" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-care-purple/10 blur-[120px] rounded-full -z-10 animate-pulse-soft" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-care-pink/5 blur-[100px] rounded-full -z-10" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center relative z-10">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-3"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-care-blue to-care-purple rounded-2xl flex items-center justify-center shadow-soft-blue">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-care-gray">CareBot AI</span>
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:flex items-center space-x-8"
        >
          <a href="#features" className="text-care-gray hover:text-care-blue transition-colors font-medium">Features</a>
          <a href="#about" className="text-care-gray hover:text-care-blue transition-colors font-medium">About</a>
          <Link to="/auth">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 border border-white/10 px-6 py-2 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Sign In
            </motion.button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-care-blue/10 border border-care-blue/20 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-care-blue rounded-full animate-pulse" />
            <span className="text-xs font-bold text-care-blue uppercase tracking-widest">Next-Gen Healthcare AI</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6">
            Your Intelligent <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-care-blue via-care-purple to-care-pink">
              Healthcare Companion
            </span>
          </h1>
          
          <p className="text-xl text-care-gray mb-10 max-w-lg leading-relaxed">
            AI-powered assistant providing 24/7 symptom analysis, accurate disease prediction, and personalized health guidance with clinical-grade intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(63, 208, 255, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-care-blue to-care-purple text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-soft-blue transition-all"
              >
                Start Free Chat
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/10 bg-white/5 text-white px-10 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all"
            >
              Explore Features
            </motion.button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/5 pt-10">
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-care-gray">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-care-gray">AI Availability</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50k+</p>
              <p className="text-sm text-care-gray">Global Users</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          {/* Main Visual */}
          <div className="relative w-full aspect-square rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-care-navy/80 to-care-purple/20 backdrop-blur-3xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-care-blue/10 via-transparent to-care-pink/10 group-hover:opacity-100 transition-opacity" />
            
            {/* Logo in Visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-64 bg-gradient-to-br from-care-blue via-care-purple to-care-pink rounded-[3rem] p-1 shadow-soft-purple"
              >
                <div className="w-full h-full bg-care-navy rounded-[2.8rem] flex flex-col items-center justify-center overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-10" />
                  <div className="text-7xl font-bold text-white mb-2">C</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-care-blue to-care-purple rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Floating UI Elements */}
            <motion.div 
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-10 right-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Heart Rate: 72 BPM</span>
              </div>
            </motion.div>

            <motion.div 
              animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-10 left-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">🛡️</span>
                <span className="text-sm font-medium">Data Secured</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
