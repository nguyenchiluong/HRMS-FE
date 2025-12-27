import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/feature/auth/store/useAuthStore';
import {
  Bell,
  CheckCircle2,
  Clock,
  Home,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function EmployeeNavBar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden max-w-[140px] text-right sm:block">
                  <p
                    className="truncate text-xs font-medium"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.roles[0]}
                  </p>
                </div>

                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
