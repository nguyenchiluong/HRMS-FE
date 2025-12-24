import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployeeHome() {
  const { user } = useAuthStore();

  // Mock data for quick actions
  const quickActions = [
    {
      title: 'View Profile',
      description: 'Update your profile',
      icon: FileText,
      path: '/employee/profile',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Time Off Request',
      description: 'Submit leave requests',
      icon: Calendar,
      path: '/employee/time/time-off-request',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'My Documents',
      description: 'Access your documents',
      icon: FileText,
      path: '/employee/documents',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Support',
      description: 'Get help from HR',
      icon: MessageSquare,
      path: '/employee/support',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  // Mock data for announcements
  const announcements = [
    {
      id: 1,
      title: 'Holiday Schedule 2025',
      date: 'Dec 20, 2024',
      preview: 'Please review the updated holiday schedule for 2025...',
    },
    {
      id: 2,
      title: 'Annual Performance Review',
      date: 'Dec 18, 2024',
      preview: 'Performance review period starts January 15th...',
    },
    {
      id: 3,
      title: 'New Health Benefits',
      date: 'Dec 15, 2024',
      preview: 'We are excited to announce new health benefits...',
    },
  ];

  // Mock data for tasks
  const pendingTasks = [
    { id: 1, title: 'Complete onboarding checklist', dueDate: 'Dec 25, 2024' },
    { id: 2, title: 'Submit timesheet', dueDate: 'Dec 27, 2024' },
    { id: 3, title: 'Review company policies', dueDate: 'Dec 30, 2024' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.name || 'Employee'}! 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Clock In
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Payslip
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
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
            <div className="text-2xl font-bold">168 hrs</div>
            <p className="text-xs text-muted-foreground">Hours worked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">In your department</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.path}>
                <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest company updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{announcement.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {announcement.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {announcement.preview}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
