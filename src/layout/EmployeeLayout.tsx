import EmployeeNavBar from '@/components/EmployeeNavBar';
import { Outlet } from 'react-router-dom';

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-background">
      <EmployeeNavBar />
      <main className="flex items-center justify-center px-4">
        <div className="w-full max-w-[2400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}