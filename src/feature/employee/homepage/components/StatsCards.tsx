import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  leaveBalance?: number;
  hoursWorked?: number;
  pendingTasksCount?: number;
  teamMembersCount?: number;
}

export default function StatsCards({
  leaveBalance = 12,
  hoursWorked = 168,
  pendingTasksCount = 0,
  teamMembersCount = 24,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{leaveBalance} days</div>
          <p className="text-xs text-muted-foreground">
            Annual leave remaining
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hoursWorked} hrs</div>
          <p className="text-xs text-muted-foreground">Hours worked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasksCount}</div>
          <p className="text-xs text-muted-foreground">Tasks to complete</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamMembersCount}</div>
          <p className="text-xs text-muted-foreground">In your department</p>
        </CardContent>
      </Card>
    </div>
  );
}
