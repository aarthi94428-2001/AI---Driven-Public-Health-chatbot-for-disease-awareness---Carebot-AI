import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const instructions = [
  {
    title: 'AI Consultation',
    description:
      'Engage with our clinical AI for instant healthcare guidance.',
    icon: '💬',
  },
  {
    title: 'Symptom Analysis',
    description:
      'Utilize advanced prediction models for condition assessment.',
    icon: '🧪',
  },
  {
    title: 'Medical Archiving',
    description:
      'Securely maintain your clinical history and health logs.',
    icon: '📜',
  },
  {
    title: 'Facility Locator',
    description:
      'Find and navigate to specialized medical institutions.',
    icon: '🏥',
  },
];

const Instructions = () => {
  // Get the logged-in user's name from localStorage
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div className="min-h-screen min-h-[100vh] bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] flex flex-col items-center justify-center px-6 py-10 relative overflow-x-hidden">

      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-care-blue/5 blur-[120px] rounded-full -z-10 animate-pulse-soft" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-care-purple/5 blur-[120px] rounded-full -z-10 animate-pulse-soft" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 max-w-3xl w-full"
      >

        {/* Logo */}
        <div className="inline-flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-care-blue to-care-purple rounded-xl flex items-center justify-center shadow-soft-blue">
            <span className="text-white font-bold text-xl">
              C
            </span>
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            CareBot AI Protocol
          </span>
        </div>

        {/* User Name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-care-blue text-lg font-semibold mb-3"
        >
          Welcome, {userName} 👋
        </motion.p>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-care-gray">
          Clinical Onboarding
        </h1>

        <p className="text-care-gray text-base md:text-lg font-medium leading-relaxed">
          Follow these core protocols to maximize your healthcare experience
          with our advanced AI ecosystem.
        </p>
      </motion.div>

      {/* Instruction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">

        {instructions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            whileHover={{
              y: -8,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }}
            className="bg-white/5 backdrop-blur-xl p-7 rounded-[2rem] border border-white/10 shadow-xl text-center group transition-all duration-300"
          >

            {/* Icon */}
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl mb-5 mx-auto border border-white/5 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-white">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-care-gray leading-relaxed">
              {item.description}
            </p>

          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 flex flex-col items-center"
      >

        <Link to="/home">

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 25px rgba(63, 208, 255, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-care-blue to-care-purple text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-soft-blue transition-all"
          >
            Enter Clinical Dashboard
          </motion.button>

        </Link>

        <p className="text-[10px] text-care-gray mt-5 uppercase tracking-[0.3em] font-bold opacity-50 text-center">
          I understand these are AI-generated insights • Proceed to Platform
        </p>

      </motion.div>

    </div>
  );
};

export default Instructions;