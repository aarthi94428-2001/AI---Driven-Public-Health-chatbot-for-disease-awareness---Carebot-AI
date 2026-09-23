import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import SymptomSelector from '../components/SymptomSelector';
import { predictDisease } from '../services/api';
import { useNavigate } from 'react-router-dom';

const symptomCategories = {
  General: ['Fever', 'Fatigue', 'Weight loss', 'Chills', 'Sweating', 'Malaise', 'Loss of appetite', 'Dehydration', 'Swollen glands', 'Body aches'],
  Respiratory: ['Cough', 'Shortness of breath', 'Chest pain', 'Sneezing', 'Runny nose', 'Sore throat', 'Wheezing', 'Nasal congestion', 'Phlegm', 'Hoarseness'],
  Digestive: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Bloating', 'Indigestion', 'Heartburn', 'Loss of bowel control', 'Blood in stool'],
  Neurological: ['Headache', 'Dizziness', 'Seizures', 'Memory loss', 'Confusion', 'Numbness', 'Tingling', 'Weakness', 'Loss of balance', 'Slurred speech'],
  Skin: ['Rash', 'Itching', 'Redness', 'Swelling', 'Hives', 'Blisters', 'Dry skin', 'Acne', 'Sores', 'Peeling skin'],
  Other: ['Frequent urination', 'Increased thirst', 'Joint pain', 'Muscle pain', 'Back pain', 'Stiff neck', 'Blurred vision', 'Ear pain', 'Mouth ulcers', 'Irritability'],
};

const allSymptoms = Object.values(symptomCategories).flat();

const PredictionPage = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = () => {
    if (symptoms.length > 0) {
      setIsLoading(true);
      setPrediction(null);
      predictDisease(symptoms)
        .then(response => {
          if (response.data.error) {
            console.error('Error predicting disease:', response.data.error);
          } else {
            setPrediction(response.data);
          }
        })
        .catch(error => {
          console.error('Error predicting disease:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="flex h-screen bg-care-navy bg-gradient-to-br from-care-navy via-[#0F172A] to-[#1E1B4B] text-white p-6 gap-6 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-y-auto scrollbar-hide p-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-care-blue to-care-purple">
              Clinical Disease Prediction
            </h1>
            <p className="text-care-gray text-lg">
              Select your symptoms below for a clinical-grade AI analysis.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] shadow-inner mb-10">
            <SymptomSelector 
              symptoms={symptoms} 
              setSymptoms={setSymptoms} 
              allSymptoms={allSymptoms} 
              symptomCategories={symptomCategories} 
            />

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <motion.button
                onClick={handlePredict}
                disabled={isLoading || symptoms.length === 0}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(63, 208, 255, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-care-blue to-care-purple rounded-2xl text-lg font-bold shadow-soft-blue disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Clinical Data...</span>
                  </>
                ) : (
                  <>
                    <span>🧪</span>
                    <span>Generate Prediction</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                onClick={() => setSymptoms([])}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold text-care-gray hover:text-white transition-all"
              >
                Reset
              </motion.button>
            </div>
            
            {symptoms.length === 0 && (
              <p className="text-center text-care-pink/60 text-sm mt-4 font-medium italic">
                * Please select at least one symptom to begin analysis.
              </p>
            )}
          </div>

          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -30 }}
                className="p-10 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[2.5rem] border border-care-blue/20 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-care-blue/10 blur-3xl rounded-full" />
                
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
                  <span className="w-8 h-8 bg-care-blue/20 rounded-lg flex items-center justify-center text-sm">📋</span>
                  <span>Analysis Results</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Predicted Condition', value: prediction.disease, icon: '🦠', color: 'text-care-blue' },
                    { label: 'Confidence Score', value: prediction.confidence, icon: '📈', color: 'text-care-purple' },
                    { label: 'Severity Level', value: prediction.severity, icon: '⚠️', color: prediction.severity === 'Severe' ? 'text-red-400' : 'text-yellow-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <p className="text-xs font-bold text-care-gray uppercase tracking-widest mb-2">{item.label}</p>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-care-gray uppercase tracking-widest mb-2">Clinical Advice</p>
                    <p className="text-lg text-care-text leading-relaxed italic">"{prediction.advice}"</p>
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <motion.button 
                    onClick={() => navigate('/hospitals')}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(63, 208, 255, 0.3)' }}
                    className="w-full sm:w-auto px-10 py-4 bg-care-blue/20 border border-care-blue/30 rounded-2xl text-care-blue font-bold flex items-center justify-center space-x-3"
                  >
                    <span>🏥</span>
                    <span>Find Nearby Hospitals</span>
                  </motion.button>
                  <p className="text-[10px] text-care-gray uppercase tracking-tighter max-w-[200px] text-center sm:text-left">
                    * Results are AI-generated. Consult a medical professional for final diagnosis.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default PredictionPage;
