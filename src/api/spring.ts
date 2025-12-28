/**
 * Axios instance for Spring Boot Backend
 *
 * Handles:
 * - Auth
 * - Activities (Campaigns)
 * - Bonus
 */

import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import axios from 'axios';

const springApi = axios.create({
  baseURL: import.meta.env.VITE_SPRING_API_URL || 'http://localhost:8080',
});

springApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

springApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default springApi;

