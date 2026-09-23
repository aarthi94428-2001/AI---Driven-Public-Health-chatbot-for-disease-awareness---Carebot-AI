// Frontend/src/components/Sidebar.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-6 flex flex-col justify-between"
    >

      <div>
        <h2 className="text-xl font-bold text-white mb-6">
          Navigation
        </h2>

        <nav>
          <ul className="space-y-4">

            {/* Home */}
            <li>
              <Link
                to="/home"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">🏠</span>
                Home
              </Link>
            </li>

            {/* AI Chat */}
            <li>
              <Link
                to="/chat"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">💬</span>
                AI Chat
              </Link>
            </li>

            {/* History */}
            <li>
              <Link
                to="/history"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">📜</span>
                History
              </Link>
            </li>

            {/* Public Updates */}
            <li>
              <Link
                to="/public-updates"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">📢</span>
                Public Updates
              </Link>
            </li>

            {/* Nearby Hospitals */}
            <li>
              <Link
                to="/hospitals"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">🏥</span>
                Nearby Hospitals
              </Link>
            </li>

            {/* Prediction */}
            <li>
              <Link
                to="/prediction"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">📊</span>
                Prediction
              </Link>
            </li>

            {/* Vaccination */}
            <li>
              <Link
                to="/vaccination"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">💉</span>
                Vaccinations
              </Link>
            </li>

            {/* Feedback */}
            <li>
              <Link
                to="/feedback"
                className="flex items-center text-care-gray hover:text-white transition-colors"
              >
                <span className="mr-3 text-lg">📝</span>
                Feedback
              </Link>
            </li>

          </ul>
        </nav>
      </div>

      <div className="text-xs text-care-gray">
        © 2024 Caring Bot. All rights reserved.
      </div>

    </motion.aside>
  );
};

export default Sidebar;