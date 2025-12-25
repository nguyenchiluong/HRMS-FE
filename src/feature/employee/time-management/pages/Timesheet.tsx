import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

interface TimesheetRow {
  id: string;
  name: string;
  weeklyData: {
    percentage: number;
    hours: number;
  }[];
}

const weekRanges = [
  { start: '11/24', end: '11/30', totalHours: 40, percentage: 100 },
  { start: '12/01', end: '12/07', totalHours: 40, percentage: 100 },
  { start: '12/08', end: '12/14', totalHours: 40, percentage: 100 },
  { start: '12/15', end: '12/21', totalHours: 40, percentage: 100 },
  {
    start: '12/22',
    end: '12/28',
    totalHours: 40,
    percentage: 0,
    isCurrentWeek: true,
  },
  { start: '12/29', end: '01/04', totalHours: 32, percentage: 0 },
];

const initialTimesheetData: TimesheetRow[] = [
  {
    id: '1',
    name: 'Daily study',
    weeklyData: [
      { percentage: 100, hours: 40 },
      { percentage: 100, hours: 40 },
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
    ],
  },
  {
    id: '2',
    name: 'Technical Research',
    weeklyData: [
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
      { percentage: 80, hours: 32 },
      { percentage: 80, hours: 32 },
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
    ],
  },
  {
    id: '3',
    name: 'Leave/outing',
    weeklyData: [
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
      { percentage: 20, hours: 8 },
      { percentage: 20, hours: 8 },
      { percentage: 0, hours: 0 },
      { percentage: 0, hours: 0 },
    ],
  },
];

export default function Timesheet() {
  const [timesheetData] = useState<TimesheetRow[]>(initialTimesheetData);

  return (
    <div className="w-full">
      <Card className="p-6">
        {/* Header Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>

            {/* Week Navigation */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[80px] text-center text-sm font-medium">
                This week
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timesheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="min-w-[200px] border-b py-3 text-left text-sm font-medium text-gray-600">
                  Requirements/Items
                </th>
                {weekRanges.map((week, index) => (
                  <th
                    key={index}
                    className={cn(
                      'min-w-[100px] border-b px-3 py-3 text-center text-xs',
                      week.isCurrentWeek && 'bg-yellow-100',
                    )}
                  >
                    <div className="font-medium">
                      {week.start} - {week.end}
                    </div>
                    <div className="text-gray-500">
                      {week.percentage}/{week.totalHours}
                      {week.percentage > 0 ? `(${week.percentage}%)` : '(0%)'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Header row for category */}
              <tr className="bg-gray-50">
                <td className="border-b py-2 pl-2 text-sm font-medium text-gray-700">
                  需求/事项
                </td>
                {weekRanges.map((week, index) => (
                  <td
                    key={index}
                    className={cn(
                      'border-b',
                      week.isCurrentWeek && 'bg-yellow-50',
                    )}
                  />
                ))}
              </tr>

              {/* Data rows */}
              {timesheetData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border-b py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Plus className="h-4 w-4" />
                      </button>
                      {row.name}
                    </div>
                  </td>
                  {row.weeklyData.map((data, index) => (
                    <td
                      key={index}
                      className={cn(
                        'border-b px-3 py-3 text-center text-sm',
                        weekRanges[index]?.isCurrentWeek && 'bg-yellow-50',
                      )}
                    >
                      {data.percentage}%/{data.hours}H
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
