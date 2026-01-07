export type Role = 'ADMIN' | 'MANAGER' | 'USER';

// JWT token payload structure
export interface TokenPayload {
  sub: string;
  mail: string;
  roles: Role[];
  empId?: number;
  iat: number;
  exp: number;
}

// User stored in auth state
export interface User {
  name: string;
  sub: string;
  email: string;
  roles: Role[];
  position?: string;
  jobLevel?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUserName: (name: string) => void;
}

