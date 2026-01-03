/**
 * Onboarding Feature API
 * Uses .NET backend (dotnetApi)
 */

import dotnetApi from '@/api/dotnet';
import type { OnboardingInfo, OnboardingPayload } from '../types';

// Validate token and get onboarding info (including any saved progress)
export const getOnboardingInfo = async (
  token: string,
): Promise<OnboardingInfo> => {
  const response = await dotnetApi.get(
    `/api/Employees/onboarding-info?token=${encodeURIComponent(token)}`,
  );
  return response.data;
};

// Submit onboarding form (complete)
export const submitOnboarding = async (
  employeeId: number,
  data: OnboardingPayload,
): Promise<void> => {
  await dotnetApi.post(`/api/Employees/${employeeId}/onboard`, data);
};

// Save onboarding progress (without completing)
export const saveOnboardingProgress = async (
  token: string,
  data: OnboardingPayload,
): Promise<OnboardingInfo> => {
  const response = await dotnetApi.put(
    `/api/Employees/onboarding-progress?token=${encodeURIComponent(token)}`,
    data,
  );
  return response.data;
};