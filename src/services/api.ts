import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    access_key: import.meta.env.VITE_API_KEY,
  };
  return config;
});

export default api;
