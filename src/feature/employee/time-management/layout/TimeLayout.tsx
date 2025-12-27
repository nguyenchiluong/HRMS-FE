import { cn } from '@/lib/utils';
import {
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  History,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  {
    path: '/employee/time/attendance',
    label: 'My Attendance',
    icon: Clock,
  },
  {
    path: '/employee/time/timesheet',
    label: 'Timesheet',
    icon: ClipboardList,
  },
  {
    path: '/employee/time/timesheet-history',
    label: 'Timesheet History',
    icon: History,
  },
  {
    path: '/employee/time/time-off-request',
    label: 'Time Off Request',
    icon: Calendar,
  },
  {
    path: '/employee/time/my-requests',
    label: 'My Requests',
    icon: FileText,
  },
];

export default function TimeLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed inset-0 top-16 flex">
      {/* Sidebar */}
      <aside className="w-84 shrink-0 border-r bg-white">
        <div className="mx-6 p-4">
          <h2 className="mb-6 mt-4 text-lg font-semibold text-slate-800">
            Time Management
          </h2>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive(item.path)
                    ? 'font-regular bg-black text-white'
                    : 'font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive(item.path) ? 'text-white' : 'text-slate-400',
                  )}
                />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 p-6 px-8">
        <Outlet />
      </main>
    </div>
  );
}
