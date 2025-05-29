import axios from 'axios';
import { authClient } from '../auth/auth-client';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const cookie = authClient.getCookie();
  if (cookie) {
    config.headers = config.headers || {};
    config.headers['Cookie'] = cookie;
  }
  return config;
});

export default api;
