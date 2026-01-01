import { useAuthStore } from '@/feature/auth/store/useAuthStore';
import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
  const { user } = useAuthStore();

  // If user has ADMIN role, go to admin dashboard
  if (user?.roles && user?.roles.includes('ADMIN')) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise (USER or MANAGER), go to employee dashboard
  return <Navigate to="/employee/dashboard" replace />;
};

export default RoleBasedRedirect;

