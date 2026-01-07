import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Award, Calendar, Clock, Wallet } from 'lucide-react';

interface StatsCardsProps {
  activeCampaigns?: number;
  myCampaigns?: number;
  bonusBalance?: number;
  pendingTimesheets?: number;
  leaveBalance?: number;
  totalHoursThisMonth?: number;
  isLoading?: boolean;
}

export default function StatsCards({
  activeCampaigns = 0,
  myCampaigns = 0,
  bonusBalance = 0,
  pendingTimesheets = 0,
  leaveBalance = 0,
  totalHoursThisMonth = 0,
  isLoading = false,
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Active Campaigns',
      value: activeCampaigns,
      description: 'Available to join',
      icon: Activity,
    },
    {
      title: 'My Campaigns',
      value: myCampaigns,
      description: 'Campaigns joined',
      icon: Award,
    },
    {
      title: 'Bonus Balance',
      value: `${bonusBalance.toLocaleString()} pts`,
      description: 'Credits available',
      icon: Wallet,
    },
    {
      title: 'Leave Balance',
      value: `${leaveBalance} days`,
      description: 'Annual leave remaining',
      icon: Calendar,
    },
    {
      title: 'Hours This Month',
      value: `${totalHoursThisMonth} hrs`,
      description: 'Approved hours',
      icon: Clock,
    },
    {
      title: 'Pending Timesheets',
      value: pendingTimesheets,
      description: 'Awaiting approval',
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
