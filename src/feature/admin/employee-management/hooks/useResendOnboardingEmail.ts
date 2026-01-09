import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { resendOnboardingEmail } from '../api';
import { employeeKeys } from './useEmployees';

interface UseResendOnboardingEmailOptions {
  onSuccess?: () => void;
}

export const useResendOnboardingEmail = (
  options?: UseResendOnboardingEmailOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => resendOnboardingEmail(employeeId),
    onSuccess: () => {
      // Invalidate employees list to refresh data if needed
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast.success('Onboarding email resent successfully!');
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to resend onboarding email');
      }
    },
  });
};
