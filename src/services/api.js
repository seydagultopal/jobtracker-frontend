import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Her istekten önce çalışacak aracı (Interceptor)
api.interceptors.request.use((config) => {
  // LocalStorage'dan JWT token'ı alıyoruz
  const token = localStorage.getItem('auth_token'); 
  
  if (token) {
    // Basic değil Bearer olmalı!
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;