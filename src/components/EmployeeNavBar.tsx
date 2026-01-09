import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { NotificationDropdown } from '@/feature/shared/notifications/components/NotificationDropdown';
import {
  CheckCircle2,
  Clock,
  Home,
  Users,
  Wallet,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUnreadCount } from '@/feature/shared/notifications/hooks/useNotifications';
import { useNotificationSSE } from '@/feature/shared/notifications/hooks/useNotificationSSE';
import UserDropdownMenu from './UserDropdownMenu';

export default function EmployeeNavBar() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Fetch unread count
  const { data: unreadCount = 0 } = useUnreadCount();

  // Set up SSE for real-time notifications
  useNotificationSSE({
    enabled: isAuthenticated,
  });

  const allNavItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: Home },
    { path: '/employee/time', label: 'Time Management', icon: Clock },
    {
      path: '/employee/approve-requests',
      label: 'Time Requests',
      icon: CheckCircle2,
      requiredRole: 'MANAGER' as const,
    },
    {
      path: '/employee/team',
      label: 'My Team',
      icon: Users,
      requiredRole: 'MANAGER' as const,
    },
    { path: '/employee/credits', label: 'My Credits', icon: Wallet },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter((item) => {
    if (item.requiredRole) {
      return user?.roles.includes(item.requiredRole);
    }
    return true;
  });

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/employee/dashboard">
              <h1 className="text-2xl font-semibold text-primary">HRMS</h1>
            </Link>

            <div className="hidden md:flex md:space-x-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    size="sm"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Notifications & User */}
          <div className="flex items-center space-x-4">
            <NotificationDropdown
              unreadCount={unreadCount}
            />

            <UserDropdownMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
