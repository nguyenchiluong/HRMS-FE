import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { useActiveCampaigns, useMyCampaigns } from '@/hooks/useCampaigns';
import {
  useBonusBalance,
  useEmployeeDashboardStats,
} from '@/hooks/useDashboard';
import ActiveCampaigns from '../components/PendingTasks';
import MyCampaigns from '../components/Announcements';
import QuickActions from '../components/QuickActions';
import StatsCards from '../components/StatsCards';
import WelcomeSection from '../components/WelcomeSection';

export default function EmployeeHome() {
  const { user } = useAuthStore();
  const { data: activeCampaigns = [], isLoading: isLoadingActive } =
    useActiveCampaigns();
  const { data: myCampaigns = [], isLoading: isLoadingMy } = useMyCampaigns();
  const { data: dashboardStats, isLoading: isLoadingStats } =
    useEmployeeDashboardStats();
  const { data: bonusData, isLoading: isLoadingBonus } = useBonusBalance();

  const isLoadingStatsCards = isLoadingStats || isLoadingBonus;

  return (
    <div className="space-y-8 px-20 py-10">
      <WelcomeSection userName={user?.name} />
      <StatsCards
        myCampaigns={myCampaigns.length}
        bonusBalance={bonusData?.currentBalance ?? 0}
        pendingTimesheets={dashboardStats?.pendingTimesheets ?? 0}
        leaveBalance={dashboardStats?.leaveBalance ?? 0}
        // totalHoursThisMonth={dashboardStats?.totalHoursThisMonth ?? 0} <-- Đã xóa dòng này
        isLoading={isLoadingStatsCards}
      />
      <QuickActions />
      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveCampaigns
          campaigns={activeCampaigns}
          isLoading={isLoadingActive}
        />
        <MyCampaigns campaigns={myCampaigns} isLoading={isLoadingMy} />
      </div>
    </div>
  );
}