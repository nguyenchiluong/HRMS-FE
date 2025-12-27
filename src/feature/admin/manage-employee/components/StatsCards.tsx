import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, UserMinus, UserPlus, Users } from 'lucide-react';
import React from 'react';
import { EmployeeStats } from '../types';

interface StatsCardsProps {
  stats: EmployeeStats | null;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const statItems = [
    {
      title: 'Total Employees',
      value: stats?.total ?? 0,
      description: 'active employees',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Onboarding',
      value: stats?.onboarding ?? 0,
      description: 'new recruits',
      icon: UserPlus,
      color: 'text-green-500',
    },
    {
      title: 'Resigned',
      value: stats?.resigned ?? 0,
      description: 'departed employees',
      icon: UserMinus,
      color: 'text-orange-500',
    },
    {
      title: 'Managers',
      value: stats?.managers ?? 0,
      description: 'leads & heads',
      icon: Briefcase,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent isLoading={isLoading}>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
