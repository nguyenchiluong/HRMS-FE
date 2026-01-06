import springApi from '@/api/spring';

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> => {
  const { data } = await springApi.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    payload,
  );
  return data;
};
