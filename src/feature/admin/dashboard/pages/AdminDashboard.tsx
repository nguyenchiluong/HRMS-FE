import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import {
  useAdminDashboardData,
  useCampaignsWithStats,
} from '@/hooks/useDashboard';
import { Activity, Briefcase, ClipboardList, DollarSign, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading: isLoadingStats } =
    useAdminDashboardData();
  const { data: campaignsWithStats = [], isLoading: isLoadingCampaigns } =
    useCampaignsWithStats();

  const stats = [
    {
      title: 'Total Employees',
      value: dashboardData?.totalEmployees ?? 0,
      description: `${dashboardData?.activeEmployees ?? 0} active`,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Departments',
      value: dashboardData?.departments ?? 0,
      description: 'Active departments',
      icon: Briefcase,
      color: 'text-green-500',
    },
    {
      title: 'Total Payroll',
      value: dashboardData
        ? `$${(dashboardData.totalPayroll / 1000).toFixed(1)}K`
        : '$0',
      description: 'Monthly expenses',
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      title: 'Active Campaigns',
      value: dashboardData?.activeCampaigns ?? 0,
      description: `${dashboardData?.completedCampaigns ?? 0} completed`,
      icon: Activity,
      color: 'text-purple-500',
    },
  ];

  const pendingApprovals = dashboardData?.pendingApprovals;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's what's happening with your organization today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items awaiting your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingStats ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Timesheets</p>
                      <p className="text-xs text-muted-foreground">
                        Pending review
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">
                    {pendingApprovals?.timesheets ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Time Off</p>
                      <p className="text-xs text-muted-foreground">
                        Leave requests
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">
                    {pendingApprovals?.timeOff ?? 0}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Overview</CardTitle>
            <CardDescription>
              Active campaigns and participation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingCampaigns ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : campaignsWithStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No campaigns found</p>
            ) : (
              campaignsWithStats.slice(0, 3).map((campaign) => (
                <div
                  key={campaign.campaignId}
                  className="flex items-center space-x-4"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      campaign.status === 'active'
                        ? 'bg-green-500'
                        : campaign.status === 'completed'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {campaign.campaignName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.participants} participants •{' '}
                      {campaign.pendingSubmissions} pending
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Stats</CardTitle>
            <CardDescription>Overall campaign metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingStats ? (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-medium">
                    {dashboardData?.totalCampaigns ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-medium text-green-600">
                    {dashboardData?.activeCampaigns ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                  <span className="font-medium text-blue-600">
                    {dashboardData?.completedCampaigns ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Draft</span>
                  <span className="font-medium text-yellow-600">
                    {dashboardData?.draftCampaigns ?? 0}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
