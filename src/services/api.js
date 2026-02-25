import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Her istekten önce çalışacak aracı (Interceptor)
api.interceptors.request.use((config) => {
  // LocalStorage'dan Basic Auth için kaydettiğimiz şifrelenmiş metni alıyoruz
  const token = localStorage.getItem('auth_token'); 
  
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

export default api;