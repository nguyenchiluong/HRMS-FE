import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';
import React from 'react';
import { MAX_HOURS_PER_WEEK } from '../../store/useTimesheetStore';
import { TimesheetRow, WeeklyTotal, WeekRange } from '../../types';

interface TimesheetTableProps {
  timesheetData: TimesheetRow[];
  weekRanges: WeekRange[];
  weeklyTotals: WeeklyTotal[];
  isEditing: boolean;
  onRemoveTask: (taskId: string) => void;
  onHoursChange: (rowId: string, weekIndex: number, hours: number) => void;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({
  timesheetData,
  weekRanges,
  weeklyTotals,
  isEditing,
  onRemoveTask,
  onHoursChange,
}) => {
  return (
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
                  'min-w-[120px] border-b px-3 py-3 text-center text-xs',
                  week.isCurrentWeek && 'bg-black/10',
                )}
              >
                <div className="py-1 font-normal">Week {week.weekNumber}</div>
                <div className="text-xs font-normal text-gray-600">
                  {week.start} - {week.end}
                </div>
                <div className="mt-2 font-normal">
                  {weeklyTotals[index].totalHours}h / {MAX_HOURS_PER_WEEK}h (
                  {weeklyTotals[index].percentage}%)
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timesheetData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border-b py-3 text-sm">
                <div className="flex items-center gap-2">
                  <button
                    className={cn(
                      'transition-colors',
                      isEditing
                        ? 'text-red-400 hover:text-red-600'
                        : 'cursor-not-allowed text-gray-300',
                    )}
                    onClick={() => isEditing && onRemoveTask(row.id)}
                    title="Remove task"
                    disabled={!isEditing}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className={cn(row.type === 'leave' && 'text-orange-600')}
                  >
                    {row.name}
                  </span>
                  {row.type === 'leave' && (
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">
                      Leave
                    </span>
                  )}
                </div>
              </td>
              {row.weeklyData.map((data, weekIndex) => (
                <td
                  key={weekIndex}
                  className={cn(
                    'border-b px-3 py-3 text-center text-sm',
                    weekRanges[weekIndex]?.isCurrentWeek && 'bg-black/5',
                  )}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={data.hours}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      const numValue = parseInt(value, 10) || 0;
                      onHoursChange(row.id, weekIndex, numValue);
                    }}
                    disabled={!isEditing}
                    className={cn(
                      'w-16 rounded border px-2 py-1 text-center text-sm focus:outline-none',
                      isEditing
                        ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500',
                    )}
                    placeholder="0"
                  />
                  <span className="ml-1 text-gray-500">h</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
