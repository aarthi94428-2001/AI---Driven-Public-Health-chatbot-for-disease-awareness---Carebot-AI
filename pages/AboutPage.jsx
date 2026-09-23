import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const AboutPage = () => {
  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-y-auto scrollbar-hide p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <header className="mb-16 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block p-4 bg-care-blue/10 rounded-[2rem] border border-care-blue/20 mb-6 shadow-soft-blue"
            >
              <span className="text-4xl">🧬</span>
            </motion.div>
            <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-care-blue to-care-purple tracking-tight">
              Mission: CareBot AI
            </h1>
            <p className="text-xl text-care-gray leading-relaxed max-w-2xl mx-auto font-medium italic">
              "Pioneering the next frontier of intelligent, clinical-grade healthcare assistance for every individual, globally."
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-care-blue/30 transition-all group">
              <h2 className="text-2xl font-bold text-care-blue mb-4 group-hover:translate-x-1 transition-transform">Our Vision</h2>
              <p className="text-care-text leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                CareBot AI is a professional healthcare ecosystem designed to bridge the gap between complex medical data and human understanding. We utilize advanced clinical-grade LLMs to provide instant, reliable, and personalized health guidance.
              </p>
            </div>
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-care-purple/30 transition-all group">
              <h2 className="text-2xl font-bold text-care-purple mb-4 group-hover:translate-x-1 transition-transform">Core Protocol</h2>
              <p className="text-care-text leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                We prioritize data integrity and clinical accuracy above all else. Our mission is to make healthcare more accessible, understandable, and actionable for everyone, anywhere, at any time.
              </p>
            </div>
          </section>

          <h2 className="text-xs font-bold text-care-gray uppercase tracking-[0.4em] mb-8 text-center">Integrated Clinical Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Real-time AI Chat', desc: 'Instant clinical-grade health queries.', icon: '🤖' },
              { title: 'Disease Prediction', desc: 'Symptom-based analysis & analysis.', icon: '🧪' },
              { title: 'History Tracking', desc: 'Secure medical journey records.', icon: '📜' },
              { title: 'Facility Locator', desc: 'Find and navigate to hospitals.', icon: '🏥' },
              { title: 'Immunization', desc: 'Vaccination and health awareness.', icon: '💉' },
              { title: 'Secure Data', desc: 'HIPAA compliant encryption.', icon: '🛡️' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/10 transition-all flex flex-col items-center text-center group"
              >
                <span className="text-3xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</span>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-xs text-care-gray">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <footer className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] text-care-gray uppercase tracking-widest font-bold mb-4">Developed by the CareBot Engineering Team</p>
            <div className="flex justify-center space-x-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                <span key={social} className="text-xs text-care-blue/60 hover:text-care-blue cursor-pointer transition-colors font-bold uppercase tracking-tighter">
                  {social}
                </span>
              ))}
            </div>
          </footer>
        </motion.div>
      </main>
    </div>
  );
};

export default AboutPage;
