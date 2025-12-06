import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// ... existing useLogin ...
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Access the cache
  const clearAuth = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => Promise.resolve(),

    onSettled: () => {
      // 1. Clear Zustand Store (Token & User)
      clearAuth();

      // 2. Clear React Query Cache
      // (Removes all cached data so the next user starts fresh)
      queryClient.clear();

      navigate('/login', { replace: true });
    },
  });
};
