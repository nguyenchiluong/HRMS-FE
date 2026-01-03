import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Redirect based on role
  if (user?.roles?.includes('ADMIN')) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
};

export default PublicRoute;
