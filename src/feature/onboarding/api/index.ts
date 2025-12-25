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

// Submit onboarding form
export const submitOnboarding = async (
  employeeId: number,
  data: OnboardingPayload,
): Promise<void> => {
  await dotnetApi.post(`/api/Employees/${employeeId}/onboard`, data);
};

