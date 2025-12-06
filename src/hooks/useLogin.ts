import { AuthResponse, login as loginApi, LoginPayload } from '@/api/auth';
import { useAuthStore, User } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: (data: AuthResponse) => {
      const { token } = data;

      // 1. Decode token
      const decodedUser = jwtDecode<User>(token);

      // 2. Update Store
      setAuth(decodedUser, token);

      // 3. Navigate based on role
      if (decodedUser.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (
        decodedUser.role === 'MANAGER' ||
        decodedUser.role === 'EMPLOYEE'
      ) {
        navigate('/employee/profile', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    },

    onError: (error: any) => {
      // You can add global toast notifications here if you want
      console.error('Login Mutation Failed:', error);
    },
  });
};
