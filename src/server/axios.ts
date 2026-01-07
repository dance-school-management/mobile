import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { authClient } from './auth-client';
import Constants from 'expo-constants';

const IP = Constants.expoConfig?.extra?.IP;

const defaultBase = Platform.select({
  android: `http://${IP}:8000`,
  ios: `http://${IP}:8000`,
  default: `http://${IP}:8000`,
}) as string;

const api = axios.create({
  baseURL: defaultBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const cookie = await authClient.getCookie?.();
      if (cookie) {
        config.headers = config.headers || {};
        config.headers['Cookie'] = cookie;
      }
    } catch (err) {
      console.warn('[axios] getCookie error', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { config?: AxiosRequestConfig & { __retryCount?: number } }) => {
    const config = error.config;
    const shouldRetry = !error.response;
    const maxRetries = 3;

    if (config && shouldRetry) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < maxRetries) {
        config.__retryCount += 1;
        const delay = 200 * Math.pow(2, config.__retryCount);
        console.warn(`[axios] network error - retry ${config.__retryCount}/${maxRetries} after ${delay}ms`, {
          url: config.url,
          method: config.method,
        });
        await new Promise((r) => setTimeout(r, delay));
        return api.request(config);
      }
    }
    console.warn('[axios] final error', {
      message: error.message,
      url: config?.url,
      method: config?.method,
      responseStatus: error.response?.status,
    });

    return Promise.reject(error);
  }
);

export default api;
