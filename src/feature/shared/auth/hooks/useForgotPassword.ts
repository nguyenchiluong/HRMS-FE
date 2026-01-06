import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ForgotPasswordPayload } from '../api/forgotPassword';
import { forgotPassword as forgotPasswordApi } from '../api/forgotPassword';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordApi(payload),

    onSuccess: () => {
      toast.success(
        'If an account exists with that email, we have sent password reset instructions.',
      );
    },

    onError: (error) => {
      console.error('Forgot password failed:', error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to send reset email. Please try again later.');
      }
    },
  });
};
