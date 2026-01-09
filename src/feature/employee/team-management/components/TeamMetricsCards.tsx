import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { TeamMembersSummary } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TeamMetricsCardsProps {
  summary: TeamMembersSummary;
  totalMembers: number;
}

export function TeamMetricsCards({ summary, totalMembers }: TeamMetricsCardsProps) {
  const {
    activeMembers,
    clockedInCount,
    totalPendingTimesheets,
    totalPendingTimeOff,
  } = summary;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Active Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeMembers}</div>
          <p className="text-xs text-muted-foreground">
            of {totalMembers} total members
          </p>
        </CardContent>
      </Card>

      {/* Currently Working */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Currently Working</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{clockedInCount}</div>
          <p className="text-xs text-muted-foreground">
            {activeMembers > 0
              ? Math.round((clockedInCount / activeMembers) * 100)
              : 0}
            % of active team
          </p>
        </CardContent>
      </Card>

      {/* Pending Timesheets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalPendingTimesheets}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </div>
            {totalPendingTimesheets > 0 && (
              <Link to="/employee/approve-requests/timesheet">
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Time Off Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Time Off</CardTitle>
          <AlertCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalPendingTimeOff}</div>
              <p className="text-xs text-muted-foreground">Leave requests</p>
            </div>
            {totalPendingTimeOff > 0 && (
              <Link to="/employee/approve-requests/time-off">
                <Button variant="outline" size="sm">
                  Review
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
