import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import Announcements from '../components/Announcements';
import PendingTasks from '../components/PendingTasks';
import QuickActions from '../components/QuickActions';
import StatsCards from '../components/StatsCards';
import WelcomeSection from '../components/WelcomeSection';

export default function EmployeeHome() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 p-10">
      <WelcomeSection userName={user?.name} />
      <StatsCards pendingTasksCount={3} />
      <QuickActions />
      <div className="grid gap-6 lg:grid-cols-2">
        <PendingTasks />
        <Announcements />
      </div>
    </div>
  );
}
