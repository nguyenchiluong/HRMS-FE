import { cn } from '@/lib/utils';
import { Calendar, ClipboardCheck } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface TabItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const tabItems: TabItem[] = [
  {
    path: '/employee/approve-requests/timesheet',
    label: 'Approve Timesheet',
    icon: ClipboardCheck,
  },
  {
    path: '/employee/approve-requests/time-off',
    label: 'Approve Time-off',
    icon: Calendar,
  },
];

export default function ApproveRequestsLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-[calc(100vh-4rem)] justify-center">
      <div className="flex w-full max-w-[2400px]">
        {/* Sidebar */}
        <aside className="w-80 shrink-0 px-8 py-6">
          <div className="h-full rounded-xl border bg-white p-4 shadow">
            <h2 className="mb-6 text-lg font-semibold text-slate-800">
              Time Requests
            </h2>
            <nav className="space-y-1">
              {tabItems.map((item) => (
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
        <main className="w-full flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
