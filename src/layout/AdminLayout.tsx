import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  ClipboardCheck,
  Home,
  LogOut,
  Settings,
  Trophy,
  Users,
} from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 focus:outline-none">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {user.name?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase() ||
                          'A'}
                      </div>
                      <div className="hidden max-w-[140px] text-right sm:block">
                        <p
                          className="truncate text-xs font-medium"
                          title={user.name || user.email}
                        >
                          {user.name || user.email}
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
                      <p className="text-sm font-medium">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate('/admin/settings')}
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
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
