import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => Promise.resolve(),

    onSettled: () => {
      // Clear Zustand Store (Token & User)
      clearAuth();

      // Clear React Query Cache
      queryClient.clear();

      navigate('/login', { replace: true });
    },
  });
};

