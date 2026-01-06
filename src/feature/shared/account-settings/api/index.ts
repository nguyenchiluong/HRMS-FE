import springApi from '@/api/spring';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> => {
  const { data } = await springApi.put<ChangePasswordResponse>(
    '/auth/change-password',
    payload,
  );
  return data;
};

