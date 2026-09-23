import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();

    // SIGN UP
    if (!isSignIn) {
      if (!name.trim()) {
        alert('Please enter your full name');
        return;
      }

      // Save user details
      localStorage.setItem('userName', name.trim());
      localStorage.setItem('userEmail', email.trim());
      localStorage.setItem('userPassword', password);

      // Go to instructions
      navigate('/instructions');
    }

    // SIGN IN
    else {
      const savedName = localStorage.getItem('userName');
      const savedEmail = localStorage.getItem('userEmail');
      const savedPassword = localStorage.getItem('userPassword');

      if (!savedName) {
        alert('No account found. Please create an account first.');
        return;
      }

      if (email.trim() !== savedEmail || password !== savedPassword) {
        alert('Invalid email or password');
        return;
      }

      // Keep logged-in user's name
      localStorage.setItem('userName', savedName);

      navigate('/instructions');
    }
  };

  return (
    <div className="min-h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-care-blue/5 blur-[120px] rounded-full -z-10 animate-pulse-soft" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-care-purple/5 blur-[120px] rounded-full -z-10 animate-pulse-soft" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10"
      >

        {/* Logo */}
        <div className="text-center mb-10">

          <Link
            to="/"
            className="inline-flex items-center space-x-3 mb-6 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-care-blue to-care-purple rounded-xl flex items-center justify-center shadow-soft-blue group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">
                C
              </span>
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              CareBot AI
            </span>
          </Link>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-white">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h2>

          <p className="text-care-gray mt-2 text-sm font-medium">
            {isSignIn
              ? 'Enter your clinical credentials to continue'
              : 'Join our global healthcare AI network'}
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">

          {/* Full Name - Sign Up Only */}
          <AnimatePresence mode="wait">
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isSignIn}
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-care-gray/50 focus:outline-none focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="relative group">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-care-gray opacity-50 group-focus-within:opacity-100 transition-opacity">
              📧
            </span>

            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-care-gray/50 focus:outline-none focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 transition-all"
            />

          </div>

          {/* Password */}
          <div className="relative group">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-care-gray opacity-50 group-focus-within:opacity-100 transition-opacity">
              🔒
            </span>

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-care-gray/50 focus:outline-none focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 transition-all"
            />

          </div>

          {/* Button */}
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(63, 208, 255, 0.3)'
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-care-blue to-care-purple text-white py-4 rounded-2xl font-bold text-lg shadow-soft-blue transition-all mt-6"
          >
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </motion.button>

        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">

          <p className="text-care-gray text-sm">

            {isSignIn
              ? "New to CareBot AI?"
              : "Already have an account?"}

            {' '}

            <button
              type="button"
              onClick={() => {
                setIsSignIn(!isSignIn);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-care-blue font-bold hover:underline transition-all"
            >
              {isSignIn
                ? 'Create an Account'
                : 'Sign In Now'}
            </button>

          </p>

        </div>

        {/* Footer */}
        <p className="text-[10px] text-center text-care-gray mt-10 uppercase tracking-[0.2em] font-bold opacity-50">
          Clinical Data Encrypted • HIPAA Compliant
        </p>

      </motion.div>

    </div>
  );
};

export default Auth;