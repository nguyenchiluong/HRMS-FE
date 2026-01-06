/**
 * Axios instance for .NET Backend
 *
 * Handles:
 * - Employee Profile
 * - Employee Requests (Leave, WFH)
 * - Timesheet
 */

import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { queryClient } from '@/main';
import axios from 'axios';

const dotnetApi = axios.create({
  baseURL: import.meta.env.VITE_DOTNET_API_URL || 'http://localhost:5188',
});

dotnetApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

dotnetApi.interceptors.response.use(
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

export default dotnetApi;

