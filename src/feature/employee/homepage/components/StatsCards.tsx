import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreditsData } from '@/pages/employeeBonus/hooks/useCreditsData';
import { Award, Calendar, FileClock, Wallet } from 'lucide-react'; // Đã bỏ Clock
import { useEffect, useState } from 'react';

interface StatsCardsProps {
  myCampaigns?: number;
  bonusBalance?: number;
  pendingTimesheets?: number;
  leaveBalance?: number;
  // totalHoursThisMonth?: number; // Đã xóa prop này
  isLoading?: boolean;
}

export default function StatsCards({
  myCampaigns = 0,
  bonusBalance = 0,
  pendingTimesheets = 0,
  leaveBalance = 0,
  // totalHoursThisMonth = 0, // Đã xóa
  isLoading = false,
}: StatsCardsProps) {
  const { currentBalance, isLoading: isBalanceLoading } = useCreditsData([]);
  const [displayBalance, setDisplayBalance] = useState(bonusBalance);

  useEffect(() => {
    if (currentBalance !== undefined) {
      setDisplayBalance(currentBalance);
    }
  }, [currentBalance]);
  const stats = [
    {
      title: 'My Campaigns',
      value: myCampaigns,
      description: 'Campaigns joined',
      icon: Award,
    },
    {
      title: 'Credit Balance',
      value: displayBalance.toLocaleString(),
      description: 'Credits available',
      icon: Wallet,
    },
    {
      title: 'Leave Balance',
      value: `${leaveBalance} days`,
      description: 'Annual leave remaining',
      icon: Calendar,
    },
    // Đã xóa thẻ "Hours This Month" ở đây
    {
      title: 'Pending Timesheets',
      value: pendingTimesheets,
      description: 'Awaiting approval',
      icon: FileClock,
    },
  ];

  return (
    // Sửa lg:grid-cols-5 thành lg:grid-cols-4
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-muted p-2">
                <stat.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                {stat.title === 'Bonus Balance' ? (
                  isBalanceLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )
                ) : isLoading ? (
                  <Skeleton className="mb-1 h-7 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
