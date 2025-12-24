import EmployeeNavBar from '@/components/EmployeeNavBar';
import { Outlet } from 'react-router-dom';

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-background">
      <EmployeeNavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
