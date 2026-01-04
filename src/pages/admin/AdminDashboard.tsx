import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/feature/shared/auth/store/useAuthStore';
import { useEmployeeStore } from '@/store/useStore';
import { Briefcase, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();

  const activeEmployees = employees.filter(
    (emp) => emp.status === 'active',
  ).length;
  const departments = [...new Set(employees.map((emp) => emp.department))]
    .length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  const stats = [
    {
      title: 'Total Employees',
      value: employees.length,
      description: `${activeEmployees} active`,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Departments',
      value: departments,
      description: 'Active departments',
      icon: Briefcase,
      color: 'text-green-500',
    },
    {
      title: 'Total Payroll',
      value: `$${(totalSalary / 1000).toFixed(1)}K`,
      description: 'Monthly expenses',
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      title: 'Growth',
      value: '+12%',
      description: 'vs last quarter',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates in your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">New employee onboarded</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Salary review completed</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Performance review due</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>
              Employee distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...new Set(employees.map((emp) => emp.department))].map(
              (dept) => {
                const count = employees.filter(
                  (emp) => emp.department === dept,
                ).length;
                const percentage = (count / employees.length) * 100;
                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{dept}</span>
                      <span className="text-muted-foreground">
                        {count} employees
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
