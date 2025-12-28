/**
 * Axios instance for .NET Backend
 *
 * Handles:
 * - Employee Profile
 * - Employee Requests (Leave, WFH)
 * - Timesheet
 */

import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
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
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default dotnetApi;

