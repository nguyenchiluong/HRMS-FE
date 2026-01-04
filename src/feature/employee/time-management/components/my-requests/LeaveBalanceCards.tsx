import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Baby,
  Calendar,
  HeartPulse,
  MoreHorizontal,
  Palmtree,
} from 'lucide-react';
import React from 'react';
import { LeaveBalance } from '../../types';

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

const getLeaveConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case 'annual leave':
      return {
        icon: Palmtree,
        color: 'bg-blue-100 text-blue-600',
      };
    case 'sick leave':
      return {
        icon: HeartPulse,
        color: 'bg-red-100 text-red-600',
      };
    case 'parental leave':
      return {
        icon: Baby,
        color: 'bg-purple-100 text-purple-600',
      };
    case 'other leave':
      return {
        icon: MoreHorizontal,
        color: 'bg-gray-100 text-gray-600',
      };
    default:
      return {
        icon: Calendar,
        color: 'bg-green-100 text-green-600',
      };
  }
};

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({
  balances,
}) => {
  const totalBalance = balances.reduce(
    (acc, b) => ({
      total: acc.total + b.total,
      used: acc.used + b.used,
      remaining: acc.remaining + b.remaining,
    }),
    { total: 0, used: 0, remaining: 0 },
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-regular text-md text-gray-900">Leave Balance</h2>
          <div className="text-sm font-normal text-muted-foreground">
            Total: {totalBalance.remaining} / {totalBalance.total} days
            remaining
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {balances.map((balance, index) => {
            const config = getLeaveConfig(balance.type);
            const IconComponent = config.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className={`rounded-lg p-2 ${config.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1 text-left">
                  <p className="text-sm font-medium">{balance.type}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {balance.remaining} / {balance.total} days
                    <br />
                    remaining
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-right text-lg font-semibold text-green-800">
                    {balance.remaining}
                  </p>
                  <p className="text-xs text-muted-foreground">available</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
