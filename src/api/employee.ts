import { useAuthStore } from '@/store/useAuthStore';
import type {
  Department,
  InitialProfilePayload,
  Position,
} from '@/types/employee';
import axios from 'axios';

// Separate axios instance for employee microservice
const employeeApi = axios.create({
  baseURL: import.meta.env.VITE_EMPLOYEE_API_URL || 'http://localhost:5188',
});

employeeApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

employeeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const getPositions = async (): Promise<Position[]> => {
  const response = await employeeApi.get('/api/Positions');
  return response.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await employeeApi.get('/api/Departments');
  return response.data;
};

export const createInitialProfile = async (
  data: InitialProfilePayload,
): Promise<void> => {
  await employeeApi.post('/api/Employees/initial-profile', data);
};
