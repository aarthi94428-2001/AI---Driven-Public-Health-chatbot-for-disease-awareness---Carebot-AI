import React from 'react';
import Sidebar from '../components/Sidebar';

const PlaceholderPage = ({ title }) => (
  <div className="flex h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 text-white p-4 gap-4">
    <Sidebar />
    <main className="flex-1 p-8 bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl border border-cyan-500 overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <p className="text-gray-400">This module is under development. Please check back later.</p>
    </main>
  </div>
);

export const Prediction = () => <PlaceholderPage title="Disease Prediction" />;
export const History = () => <PlaceholderPage title="Health History" />;
export const Hospitals = () => <PlaceholderPage title="Nearby Hospitals" />;
export const Vaccination = () => <PlaceholderPage title="Vaccination Awareness" />;
export const Profile = () => <PlaceholderPage title="User Profile" />;
export const Feedback = () => <PlaceholderPage title="Feedback" />;
export const About = () => <PlaceholderPage title="About CareBot AI" />;
export const Settings = () => <PlaceholderPage title="Settings" />;
