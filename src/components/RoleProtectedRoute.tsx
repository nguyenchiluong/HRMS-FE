import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import type { Role } from '@/feature/shared/auth/types';
import { Navigate, Outlet } from 'react-router-dom';

interface RoleProtectedRouteProps {
  requiredRole: Role;
}

const RoleProtectedRoute = ({ requiredRole }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.roles.includes(requiredRole)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;

