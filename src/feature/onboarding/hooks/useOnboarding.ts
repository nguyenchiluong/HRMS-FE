import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { getOnboardingInfo, submitOnboarding } from '../api';
import type { OnboardingPayload } from '../types';

// Hook to fetch onboarding info using token (validates token + gets employee data)
export const useOnboardingInfo = (token: string | undefined) => {
  return useQuery({
    queryKey: ['onboardingInfo', token],
    queryFn: () => getOnboardingInfo(token!),
    enabled: !!token,
    retry: false,
  });
};

interface UseOnboardingOptions {
  onSuccess?: () => void;
}

// Hook to submit onboarding form
export const useOnboarding = (
  employeeId: number | undefined,
  options?: UseOnboardingOptions,
) => {
  return useMutation({
    mutationFn: (data: OnboardingPayload) => submitOnboarding(employeeId!, data),
    onSuccess: () => {
      toast.success('Onboarding completed successfully!');
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit onboarding form. Please try again.');
      }
    },
  });
};

