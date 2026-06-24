// src/api.js
import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; 
// Ensure VITE_API_URL === "http://localhost:5000/api" in frontend/.env

const api = axios.create({ baseURL: base });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
