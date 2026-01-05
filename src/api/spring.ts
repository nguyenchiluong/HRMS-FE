/**
 * Axios instance for Spring Boot Backend
 *
 * Handles:
 * - Auth
 * - Activities (Campaigns)
 * - Bonus
 */

import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { queryClient } from '@/main';
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
      const authStore = useAuthStore.getState();
      // Only logout if we're actually authenticated (avoid infinite loops)
      if (authStore.isAuthenticated) {
        authStore.logout();
        // Invalidate all React Query cache
        queryClient.invalidateQueries();
        queryClient.clear();
        // Let React Router handle the redirect via ProtectedRoute
        // Don't use window.location.href as it causes full page reload
        // and conflicts with React Router
      }
    }
    return Promise.reject(error);
  },
);

export default springApi;

