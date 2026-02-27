import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token'); 
  
  // 403 HATASI ÇÖZÜMÜ: /auth/ adreslerine token ekleme
  if (token && !config.url.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;