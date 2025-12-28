import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  getOnboardingInfo,
  saveOnboardingProgress,
  submitOnboarding,
} from '../api';
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

// Hook to submit onboarding form (complete)
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

// Hook to save onboarding progress (without completing)
export const useSaveOnboardingProgress = (token: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingPayload) => saveOnboardingProgress(token!, data),
    onSuccess: () => {
      toast.success('Progress saved successfully!');
      // Invalidate to refresh the data if user comes back
      queryClient.invalidateQueries({ queryKey: ['onboardingInfo', token] });
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save progress. Please try again.');
      }
    },
  });
};

