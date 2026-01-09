import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { useLogout } from '@/feature/shared/auth/hooks/useLogout';
import { ChevronDown, LogOut, Settings, User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserDropdownMenu() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  if (!user) return null;

  // Determine settings route based on user role
  const settingsRoute = user.roles.includes('ADMIN')
    ? '/admin/settings'
    : '/employee/settings';

  // Get display name with fallback
  const displayName = user.name || user.email || 'User';
  const displayInitial =
    user.name?.charAt(0).toUpperCase() ||
    user.email?.charAt(0).toUpperCase() ||
    'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 focus:outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {displayInitial}
          </div>
          <div className="hidden max-w-[140px] text-right sm:block">
            <p
              className="truncate text-xs font-medium"
              title={displayName}
            >
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.position && user.jobLevel
                ? `${user.position} - ${user.jobLevel}`
                : user.roles[0] === 'USER'
                  ? 'EMPLOYEE'
                  : user.roles[0]}
            </p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 px-5 py-3">
        <div className="px-2 py-2">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {user.position && user.jobLevel && (
            <p className="text-xs text-muted-foreground mt-1">
              {user.position} - {user.jobLevel}
            </p>
          )}
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
          onClick={() => navigate(settingsRoute)}
          className="cursor-pointer text-xs"
        >
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(user.roles.includes('ADMIN') ? '/admin/bonus' : '/employee/credits')}
          className="cursor-pointer text-xs"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {user.roles.includes('ADMIN') ? 'Credit Settings' : 'My Credits'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-xs text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

