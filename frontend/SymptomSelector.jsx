import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SymptomSelector = ({ symptoms, setSymptoms, allSymptoms, symptomCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredSymptoms = useMemo(() => {
    if (!searchTerm) return allSymptoms;
    return allSymptoms.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, allSymptoms]);

  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else if (symptoms.length < 15) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  return (
    <div className="relative">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-3 mb-6 min-h-[40px]">
        <AnimatePresence>
          {symptoms.map(symptom => (
            <motion.div
              key={symptom}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-care-blue/10 text-care-blue px-4 py-1.5 rounded-xl text-sm font-bold border border-care-blue/30 shadow-soft-blue flex items-center space-x-2 group"
            >
              <span>{symptom}</span>
              <button 
                onClick={() => toggleSymptom(symptom)}
                className="hover:text-care-pink transition-colors ml-1 text-lg leading-none"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.01 }}
          className={`w-full p-5 rounded-2xl border transition-all duration-300 text-left flex justify-between items-center ${
            isOpen 
              ? 'bg-white/10 border-care-blue/50 shadow-soft-blue' 
              : 'bg-white/5 border-white/10 hover:border-white/20'
          }`}
        >
          <span className={symptoms.length > 0 ? 'text-white font-medium' : 'text-care-gray'}>
            {symptoms.length > 0 ? `${symptoms.length} symptoms selected` : 'Select clinical symptoms...'}
          </span>
          <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-20 w-full mt-4 p-6 bg-[#161F3A] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-care-gray">🔍</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search symptoms (e.g. Fever, Fatigue)..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:ring-2 focus:ring-care-blue/30 focus:border-care-blue/30 focus:outline-none transition-all"
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {Object.entries(symptomCategories).map(([category, symptomsInCategory]) => {
                    const categorySymptoms = symptomsInCategory.filter(s => filteredSymptoms.includes(s));
                    if (categorySymptoms.length === 0) return null;

                    return (
                      <div key={category} className="mb-8 last:mb-0">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-1 h-4 bg-care-blue rounded-full" />
                          <h3 className="text-sm font-bold text-care-gray uppercase tracking-[0.2em]">{category}</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {categorySymptoms.map(symptom => {
                            const isSelected = symptoms.includes(symptom);
                            return (
                              <motion.button
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                                  isSelected 
                                    ? 'bg-care-blue text-care-navy font-bold shadow-soft-blue' 
                                    : 'bg-white/5 text-care-text hover:bg-white/10 border border-white/5'
                                }`}
                              >
                                {symptom}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SymptomSelector;
