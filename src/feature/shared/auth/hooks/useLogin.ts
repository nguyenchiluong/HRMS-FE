import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getEmployeeById, getPositions, getJobLevels } from '@/feature/admin/employee-management/api';
import { login as loginApi } from '../api/login';
import { useAuthStore } from '../store/useAuthStore';
import type { AuthResponse, LoginPayload, TokenPayload, User } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: async (data: AuthResponse) => {
      const { token } = data;

      // Decode token
      const decoded = jwtDecode<TokenPayload>(token);

      // Determine user name, position, and job level
      let userName: string;
      let position: string | undefined;
      let jobLevel: string | undefined;
      
      if (decoded.empId) {
        try {
          // Fetch employee data to get the full name
          const employee = await getEmployeeById(decoded.empId);
          userName = employee.preferredName || employee.fullName;
          
          // Fetch positions and job levels to resolve names
          if (employee.positionId || employee.jobLevelId) {
            const [positions, jobLevels] = await Promise.all([
              getPositions(),
              getJobLevels(),
            ]);
            
            if (employee.positionId) {
              const pos = positions.find((p) => p.id === employee.positionId);
              position = pos?.title;
            }
            
            if (employee.jobLevelId) {
              const level = jobLevels.find((l) => l.id === employee.jobLevelId);
              jobLevel = level?.name;
            }
          }
        } catch (error) {
          // If fetching employee fails, fall back to email
          console.error('Failed to fetch employee data:', error);
          userName = decoded.mail;
        }
      } else {
        // For accounts without empId (e.g., admin), use a descriptive name
        userName = 'HRMS Admin';
      }

      // Extract user info from token
      const user: User = {
        name: userName,
        sub: decoded.sub,
        email: decoded.mail,
        roles: decoded.roles,
        position,
        jobLevel,
      };

      // Update Store
      setAuth(user, token);

      // Navigate to root - RoleBasedRedirect will handle the rest
      navigate('/', { replace: true });
    },

    onError: (error) => {
      console.error('Login failed:', error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    },
  });
};

