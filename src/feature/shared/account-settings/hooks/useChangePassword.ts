import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { changePassword, type ChangePasswordPayload } from '../api';

interface UseChangePasswordOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useChangePassword = (options?: UseChangePasswordOptions) => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: (response) => {
      toast.success(response.message || 'Password has been successfully updated!');
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update password. Please try again.');
      }
      options?.onError?.(error);
    },
  });
};

