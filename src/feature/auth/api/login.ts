import springApi from '@/api/spring';
import type { AuthResponse, LoginPayload } from '../types';

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await springApi.post<AuthResponse>('/auth/login', payload);
  return data;
};

