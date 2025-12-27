import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/login';
import { useAuthStore } from '../store/useAuthStore';
import type { AuthResponse, LoginPayload, TokenPayload, User } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: (data: AuthResponse) => {
      const { token } = data;

      // Decode token
      const decoded = jwtDecode<TokenPayload>(token);

      // Extract user info from token
      const user: User = {
        sub: decoded.sub,
        email: decoded.mail,
        roles: decoded.roles,
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

