import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { NotificationDropdown } from '@/feature/shared/notifications/components/NotificationDropdown';
import {
  ClipboardCheck,
  Home,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useUnreadCount } from '@/feature/shared/notifications/hooks/useNotifications';
import { useNotificationSSE } from '@/feature/shared/notifications/hooks/useNotificationSSE';
import UserDropdownMenu from '@/components/UserDropdownMenu';

export default function AdminLayout() {
  const { isAuthenticated } = useAuthStore();

  // Fetch unread count
  const { data: unreadCount = 0 } = useUnreadCount();

  // Set up SSE for real-time notifications
  useNotificationSSE({
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-semibold text-primary">HRMS</h1>
              <div className="flex space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/employees">
                  <Button variant="ghost" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Employees
                  </Button>
                </Link>
                <Link to="/admin/campaigns">
                  <Button variant="ghost" size="sm">
                    <Trophy className="mr-2 h-4 w-4" />
                    Campaigns
                  </Button>
                </Link>
                <Link to="/admin/profile-requests">
                  <Button variant="ghost" size="sm">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Profile Requests
                  </Button>
                </Link>
                <Link to="/admin/bonus">
                  <Button variant="ghost" size="sm">
                    <Wallet className="mr-2 h-4 w-4" />
                    Credit Settings
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown
                unreadCount={unreadCount}
              />
              <UserDropdownMenu />
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
