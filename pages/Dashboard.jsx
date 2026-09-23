import React from 'react';
import Sidebar from '../components/Sidebar';
import FeatureCard from '../components/FeatureCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'AI Health Chat',
    description:
      'Intelligent conversation for medical guidance and support.',
    icon: '🤖',
    path: '/chat',
    color: 'care-blue',
  },
  {
    title: 'Disease Prediction',
    description:
      'Symptom-based analysis with clinical-grade accuracy.',
    icon: '🧪',
    path: '/prediction',
    color: 'care-purple',
  },
  {
    title: 'Health History',
    description:
      'Securely track and analyze your medical journey.',
    icon: '📜',
    path: '/history',
    color: 'care-pink',
  },
  {
    title: 'Nearby Hospitals',
    description:
      'Find and navigate to the best care facilities near you.',
    icon: '🏥',
    path: '/hospitals',
    color: 'care-blue',
  },
  {
    title: 'Public Updates',
    description:
      'Stay informed with the latest health alerts and news.',
    icon: '📢',
    path: '/public-updates',
    color: 'care-purple',
  },
  {
    title: 'Vaccination',
    description:
      'Manage and track your immunization records.',
    icon: '💉',
    path: '/vaccination',
    color: 'care-pink',
  },
];

const Dashboard = () => {
  // Get logged-in user's name
  const userName = localStorage.getItem('userName') || 'User';

  // Create user initials
  const initials = userName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white">

      {/* Main Layout */}
      <div className="flex min-h-screen w-full p-4 md:p-6 gap-4 md:gap-6">

        {/* ================= SIDEBAR ================= */}
        <Sidebar />

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 min-w-0 flex flex-col gap-6 md:gap-8 relative">

          {/* ================= TOP HEADER ================= */}
          <header className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 bg-white/5 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-xl">

            {/* Welcome Text */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-care-gray">
                Welcome back, {userName} 👋
              </h1>

              <p className="text-care-gray mt-2 text-sm md:text-base">
                Your health overview is looking good today.
              </p>
            </motion.div>

            {/* User Section */}
            <div className="flex items-center justify-between lg:justify-end gap-3">

              {/* Notification */}
              <button
                type="button"
                className="w-11 h-11 md:w-12 md:h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors relative"
              >
                <span className="text-xl">
                  🔔
                </span>

                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-care-blue rounded-full shadow-soft-blue" />
              </button>

              {/* Divider */}
              <div className="hidden sm:block h-10 w-[1px] bg-white/10 mx-1" />

              {/* Logged-in User */}
              <div className="flex items-center gap-3 bg-white/5 px-3 md:px-4 py-2 rounded-2xl border border-white/10">

                {/* Initials */}
                <div className="w-9 h-9 rounded-full bg-care-blue/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-care-blue">
                    {initials}
                  </span>
                </div>

                {/* Name */}
                <span className="text-sm font-bold max-w-[150px] truncate">
                  {userName}
                </span>

              </div>
            </div>
          </header>

          {/* ================= STATS GRID ================= */}
          <section className="w-full">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">

              {[
                {
                  label: 'Heart Rate',
                  value: '72',
                  unit: 'bpm',
                  icon: '❤️',
                  trend: '+2%',
                  color: 'care-pink',
                },
                {
                  label: 'Sleep',
                  value: '7.5',
                  unit: 'hrs',
                  icon: '🌙',
                  trend: '-5%',
                  color: 'care-purple',
                },
                {
                  label: 'Steps',
                  value: '8,432',
                  unit: 'steps',
                  icon: '🏃',
                  trend: '+12%',
                  color: 'care-blue',
                },
                {
                  label: 'Calories',
                  value: '1,240',
                  unit: 'kcal',
                  icon: '🔥',
                  trend: '+8%',
                  color: 'care-pink',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full bg-white/5 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
                >

                  <div className="flex justify-between items-start mb-4">

                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                      {stat.icon}
                    </div>

                    <span
                      className={`text-xs font-bold ${
                        stat.trend.startsWith('+')
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {stat.trend}
                    </span>

                  </div>

                  <h3 className="text-care-gray text-sm font-medium mb-1">
                    {stat.label}
                  </h3>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      {stat.value}
                    </span>

                    <span className="text-xs text-care-gray">
                      {stat.unit}
                    </span>
                  </div>

                </motion.div>
              ))}

            </div>

          </section>

          {/* ================= FEATURES SECTION ================= */}
          <section className="w-full">

            <h2 className="text-2xl font-bold mb-5 px-1">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">

              {features.map((feature, index) => (
                <Link
                  to={feature.path}
                  key={index}
                  className="w-full"
                >
                  <FeatureCard
                    {...feature}
                    index={index}
                  />
                </Link>
              ))}

            </div>

          </section>

          {/* ================= AI BANNER ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-gradient-to-r from-care-blue/20 via-care-purple/20 to-care-pink/20 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 relative overflow-hidden group"
          >

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-care-blue/10 blur-[80px] rounded-full -z-10 group-hover:bg-care-blue/20 transition-colors" />

            <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8">

              {/* Text Content */}
              <div className="max-w-2xl text-center xl:text-left">

                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                  Empower Your Health with
                  <br />

                  <span className="text-care-blue">
                    Advanced AI
                  </span>
                </h2>

                <p className="text-care-gray text-base md:text-lg mb-7 leading-relaxed">
                  Get instant, data-driven medical insights.
                  CareBot AI uses clinical-grade protocols to
                  analyze your symptoms and provide reliable
                  guidance.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">

                  <Link to="/chat">

                    <motion.button
                      type="button"
                      whileHover={{
                        scale: 1.05,
                        boxShadow:
                          '0 0 20px rgba(63, 208, 255, 0.4)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto bg-care-blue text-care-navy px-8 py-4 rounded-2xl font-bold transition-all"
                    >
                      Start AI Chat
                    </motion.button>

                  </Link>

                  <Link to="/about">

                    <motion.button
                      type="button"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor:
                          'rgba(255, 255, 255, 0.1)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto border border-white/10 bg-white/5 text-white px-8 py-4 rounded-2xl font-bold backdrop-blur-sm transition-all"
                    >
                      How it Works
                    </motion.button>

                  </Link>

                </div>
              </div>

              {/* AI Icon */}
              <div className="w-36 h-36 md:w-48 md:h-48 shrink-0 bg-gradient-to-br from-care-blue to-care-purple rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-soft-purple animate-pulse-soft">

                <span className="text-6xl md:text-7xl">
                  🤖
                </span>

              </div>

            </div>
          </motion.div>

          {/* Bottom Spacing */}
          <div className="h-4 shrink-0" />

        </main>
      </div>
    </div>
  );
};

export default Dashboard;