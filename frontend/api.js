// Frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL || '/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessageToAI = async (message) => {
  try {
    const response = await api.post('/api/chat', { message });
    return response.data.response;
  } catch (error) {
    console.error("Chatbot API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const analyzeImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await api.post('/api/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Image Analysis API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const predictDisease = async (symptoms) => {
  try {
    const response = await api.post('/api/predict', { symptoms });
    return response;
  } catch (error) {
    console.error("Prediction API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getNearbyHospitals = async (params) => {
  try {
    const response = await api.get('/api/hospitals/', { params });
    return response;
  } catch (error) {
    console.error("Hospitals API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const response = await api.get('/api/history/chat-history');
    return response;
  } catch (error) {
    console.error("History API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteHistoryItem = async (itemId) => {
  try {
    const response = await api.delete(`/api/history/${itemId}`);
    return response;
  } catch (error) {
    console.error("Delete History API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const clearAllHistory = async () => {
  try {
    const response = await api.delete('/api/history/clear/all');
    return response;
  } catch (error) {
    console.error("Clear History API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPreventionTips = async () => {
  try {
    const response = await api.get('/api/vaccinations/prevention');
    return response;
  } catch (error) {
    console.error("Prevention Tips API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPublicUpdates = async () => {
  try {
    const response = await api.get('/api/updates/');
    return response;
  } catch (error) {
    console.error("Public Updates API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getVaccinations = async (age) => {
  try {
    const response = await api.get('/api/vaccinations/', { params: { age } });
    return response;
  } catch (error) {
    console.error("Vaccinations API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateVaccinationStatus = async (data) => {
  try {
    const response = await api.post('/api/vaccinations/status', data);
    return response;
  } catch (error) {
    console.error("Update Vaccination Status API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const submitFeedback = async (data) => {
  try {
    const response = await api.post('/api/feedback/', data);
    return response;
  } catch (error) {
    console.error("Submit Feedback API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
