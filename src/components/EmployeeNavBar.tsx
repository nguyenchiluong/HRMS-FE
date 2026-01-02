import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { NotificationDropdown } from '@/feature/shared/notifications/components/NotificationDropdown';
import { Notification } from '@/feature/shared/notifications/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/pages/employeeProfileManagement/components/ui/dropdown-menu';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Mock notifications data
const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const today = new Date();

  const notificationTemplates = [
    {
      title: 'Timesheet Approved',
      content: 'Your timesheet for Week 1 has been approved by your manager.',
    },
    {
      title: 'Time-off Request Pending',
      content:
        'Your time-off request is pending approval. Please wait for manager review.',
    },
    {
      title: 'Profile Update Required',
      content:
        'Please update your emergency contact information in your profile.',
    },
    {
      title: 'New Campaign Available',
      content: 'A new wellness campaign has been launched. Check it out!',
    },
    {
      title: 'Password Change Successful',
      content: 'Your password has been successfully changed.',
    },
  ];

  for (let i = 0; i < 8; i++) {
    const notificationDate = new Date(today);
    notificationDate.setHours(today.getHours() - i * 2);

    const template = notificationTemplates[i % notificationTemplates.length];

    notifications.push({
      id: `NOTIF-${String(i + 1).padStart(4, '0')}`,
      title: template.title,
      content: template.content,
      time: notificationDate,
      isRead: i >= 3, // First 3 are unread
    });
  }

  return notifications;
};

export default function EmployeeNavBar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(
    generateMockNotifications,
  );

  const navItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: Home },
    { path: '/employee/profile', label: 'Profile', icon: User },
    { path: '/employee/time', label: 'Time Management', icon: Clock },
    {
      path: '/employee/approve-requests',
      label: 'Request Approval',
      icon: CheckCircle2,
    },
    { path: '/employee/settings', label: 'Settings', icon: Settings },
  ];

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
              notifications={notifications}
              unreadCount={notifications.filter((n) => !n.isRead).length}
              onMarkAsRead={(id) => {
                setNotifications((prev) =>
                  prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
                );
              }}
              onMarkAllAsRead={() => {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, isRead: true })),
                );
              }}
            />

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 focus:outline-none">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden max-w-[140px] text-right sm:block">
                      <p
                        className="truncate text-xs font-medium"
                        title={user.name}
                      >
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.roles[0]}
                      </p>
                    </div>
                    <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 px-5 py-3">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/employee/profile')}
                    className="cursor-pointer text-xs"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Personal Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/employee/settings')}
                    className="cursor-pointer text-xs"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-xs text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
