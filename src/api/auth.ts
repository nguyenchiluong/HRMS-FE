import springApi from './spring';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await springApi.post<AuthResponse>('/auth/login', payload);
  return data;
};
