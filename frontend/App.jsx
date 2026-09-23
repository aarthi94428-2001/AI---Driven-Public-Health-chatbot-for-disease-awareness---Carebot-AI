import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Instructions from './pages/Instructions';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import PredictionPage from './pages/PredictionPage';
import NearbyHospitalsPage from './pages/NearbyHospitalsPage';
import HistoryPage from './pages/HistoryPage';
import VaccinationAwarenessPage from './pages/VaccinationAwarenessPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import FeedbackPage from './pages/FeedbackPage';
import PublicUpdatesPage from './pages/PublicUpdatesPage';
import PreventionPage from './pages/PreventionPage';
import { Profile } from './pages/Placeholders';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/prediction" element={<PredictionPage />} />
        <Route path="/hospitals" element={<NearbyHospitalsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/vaccination" element={<VaccinationAwarenessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/public-updates" element={<PublicUpdatesPage />} />
        <Route path="/prevention" element={<PreventionPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
