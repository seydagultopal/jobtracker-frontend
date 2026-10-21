import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

const getCookie = (name) => {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : null;
};

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const safeMethods = ['get', 'head', 'options', 'trace'];

  if (!safeMethods.includes(method) && !config.url?.includes('/api/auth/csrf')) {
    if (!getCookie('XSRF-TOKEN')) {
      await api.get('/api/auth/csrf');
    }

    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  return config;
});

export default api;