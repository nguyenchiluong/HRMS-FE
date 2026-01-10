import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Coins, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
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
    path: '/employee/time/my-requests',
    color: 'bg-green-100 text-green-600',
  },
  // {
  //   title: 'My Documents',
  //   description: 'Access your documents',
  //   icon: FileText,
  //   path: '/employee/documents',
  //   color: 'bg-purple-100 text-purple-600',
  // },
  // {
  //   title: 'Support',
  //   description: 'Get help from HR',
  //   icon: MessageSquare,
  //   path: '/employee/support',
  //   color: 'bg-orange-100 text-orange-600',
  // },
  {
    title: 'My Credits',
    description: 'View your bonus credits',
    icon: Coins,
    path: '/employee/credits',
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export default function QuickActions() {
  return (
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
  );
}
