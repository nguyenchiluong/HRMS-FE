import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import {
  useAdminDashboardData,
  useCampaignsWithStats,
} from '@/hooks/useDashboard';
import { usePendingCampaigns } from '@/hooks/useApprovals';
import { useProfileChangeRequests } from '@/feature/admin/profile-requests/hooks/useProfileChangeRequests';
import { 
  Activity, 
  Briefcase, 
  ClipboardList, 
  Users, 
  CheckCircle2, 
  CircleDashed,
  Flame,
  ChevronRight // Thêm icon mũi tên
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Thêm Link để điều hướng

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading: isLoadingStats } = useAdminDashboardData();
  const { data: campaignsWithStats = [], isLoading: isLoadingCampaigns } = useCampaignsWithStats();
  const { data: pendingCampaignsData } = usePendingCampaigns();
  
  // Lấy số lượng profile change requests đang pending
  // Sử dụng limit=1 và status='PENDING' để chỉ lấy pagination.total, không cần data thực tế
  const { data: pendingProfileRequestsResponse } = useProfileChangeRequests(1, 1, 'PENDING');

  // --- 1. THỐNG KÊ TỔNG QUAN (TOP CARDS) ---
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
      title: 'Total Campaigns',
      value: dashboardData?.totalCampaigns ?? 0,
      description: `Created Campaigns`,
      icon: Activity,
      color: 'text-purple-500',
    },
  ];
  
  // Tính tổng số pending submissions từ tất cả campaigns
  const totalPendingSubmissions = pendingCampaignsData?.reduce(
    (sum, campaign) => sum + (campaign.pendingCount || 0),
    0
  ) || 0;
  
  // Lấy số lượng pending profile requests
  const pendingProfileRequestsCount = pendingProfileRequestsResponse?.pagination?.total || 0;

  // --- 2. TÍNH TOÁN DỮ LIỆU ---
  const totalStats = dashboardData?.totalCampaigns || 1;
  const activePct = ((dashboardData?.activeCampaigns || 0) / totalStats) * 100;
  const completedPct = ((dashboardData?.completedCampaigns || 0) / totalStats) * 100;
  const draftPct = ((dashboardData?.draftCampaigns || 0) / totalStats) * 100;

  const topCampaigns = [...campaignsWithStats]
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 3);

  const totalEmployees = dashboardData?.totalEmployees || 1;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here's what's happening with your organization today.
        </p>
      </div>

      {/* TOP STATS GRID (3 CỘT) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* BOTTOM GRID (3 CỘT) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* CỘT 1: QUICK ACTIONS (Đã sửa từ Pending Approvals) */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage pending requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingStats ? (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            ) : (
              <>
                {/* ACTION 1: Profile Requests */}
                <Link to="/admin/profile-requests" className="block group">
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-slate-50 hover:border-orange-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-50 p-2 rounded-full group-hover:bg-orange-100 transition-colors">
                            <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                        <p className="font-medium text-slate-900 group-hover:text-orange-700 transition-colors">Profile Requests</p>
                        <p className="text-xs text-muted-foreground">
                            Pending review
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Số lượng */}
                        <span className="text-xl font-bold text-slate-900">{pendingProfileRequestsCount}</span>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    </div>
                </Link>

                {/* ACTION 2: Approval Requests */}
                <Link to="/admin/campaigns/approvals" className="block group">
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-all hover:bg-slate-50 hover:border-blue-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">Approval Requests</p>
                        <p className="text-xs text-muted-foreground">
                            Pending approval
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Số lượng */}
                        <span className="text-xl font-bold text-slate-900">{totalPendingSubmissions}</span>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                    </div>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* CỘT 2: TOP CAMPAIGNS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500 fill-orange-100" />
                Top Campaigns
            </CardTitle>
            <CardDescription>
              Most popular by participation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingCampaigns ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : topCampaigns.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              topCampaigns.map((campaign, index) => (
                <div
                  key={campaign.campaignId}
                  className="flex items-center space-x-3 pb-2 border-b last:border-0 last:pb-0"
                >
                  <div className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-slate-100 text-slate-700' : 
                      'bg-orange-50 text-orange-700'}
                  `}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium line-clamp-1">{campaign.campaignName}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min((campaign.participants / totalEmployees) * 100, 100)}%` }} 
                        />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900">{campaign.participants}</span>
                    <span className="text-[10px] text-muted-foreground">joined</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* CỘT 3: CAMPAIGN STATUS DISTRIBUTION */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Status</CardTitle>
            <CardDescription>Overall distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoadingStats ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
                    <div style={{ width: `${activePct}%` }} className="bg-green-500" title="Active" />
                    <div style={{ width: `${completedPct}%` }} className="bg-blue-500" title="Completed" />
                    <div style={{ width: `${draftPct}%` }} className="bg-yellow-500" title="Draft" />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-700">Active</span>
                        </div>
                        <span className="font-bold text-slate-900">{dashboardData?.activeCampaigns ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-700">Completed</span>
                        </div>
                        <span className="font-bold text-slate-900">{dashboardData?.completedCampaigns ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CircleDashed className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-slate-700">Draft</span>
                        </div>
                        <span className="font-bold text-slate-900">{dashboardData?.draftCampaigns ?? 0}</span>
                    </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}