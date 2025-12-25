import type { InitialProfilePayload } from '@/types/employee';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { createInitialProfile } from '../api';

interface UseCreateInitialProfileOptions {
  onSuccess?: () => void;
}

export const useCreateInitialProfile = (
  options?: UseCreateInitialProfileOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitialProfilePayload) => createInitialProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee onboarded successfully!');
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to onboard employee');
      }
    },
  });
};

