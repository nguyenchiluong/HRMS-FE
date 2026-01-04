import { cn } from '@/lib/utils';
import { Check, Clock, Minus, X } from 'lucide-react';
import React from 'react';
import { MAX_HOURS_PER_WEEK } from '../../store/useTimesheetStore';
import type { TimesheetRow, TimesheetStatus, WeeklyTotal, WeekRange } from '../../types';

interface TimesheetTableProps {
  timesheetData: TimesheetRow[];
  weekRanges: WeekRange[];
  weeklyTotals: WeeklyTotal[];
  selectedWeekIndex: number;
  onSelectWeek: (weekIndex: number) => void;
  onRemoveTask: (taskId: string) => void;
  onHoursChange: (rowId: string, weekIndex: number, hours: number) => void;
  getWeekStatus: (weekIndex: number) => TimesheetStatus;
  canEditWeek: (weekIndex: number) => boolean;
}

const getWeekStatusIcon = (status: TimesheetStatus) => {
  switch (status) {
    case 'APPROVED':
      return <Check className="h-3 w-3 text-green-600" />;
    case 'PENDING':
      return <Clock className="h-3 w-3 text-yellow-600" />;
    case 'REJECTED':
      return <X className="h-3 w-3 text-red-600" />;
    default:
      return null;
  }
};

export const TimesheetTable: React.FC<TimesheetTableProps> = ({
  timesheetData,
  weekRanges,
  weeklyTotals,
  selectedWeekIndex,
  onSelectWeek,
  onRemoveTask,
  onHoursChange,
  getWeekStatus,
  canEditWeek,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="min-w-[200px] border-b py-3 text-left text-sm font-medium text-gray-600">
              Requirements/Items
            </th>
            {weekRanges.map((week, index) => {
              const status = getWeekStatus(index);
              const isSelected = index === selectedWeekIndex;

              return (
                <th
                  key={index}
                  onClick={() => onSelectWeek(index)}
                  className={cn(
                    'min-w-[120px] cursor-pointer border-b px-3 py-3 text-center text-xs transition-colors',
                    week.isCurrentWeek && 'bg-blue-50',
                    isSelected && 'bg-slate-100 ring-2 ring-inset ring-slate-300',
                    !isSelected && 'hover:bg-gray-50',
                  )}
                >
                  <div className="flex items-center justify-center gap-1 py-1 font-normal">
                    <span>Week {week.weekNumber}</span>
                    {getWeekStatusIcon(status)}
                  </div>
                  <div className="text-xs font-normal text-gray-600">
                    {week.start} - {week.end}
                  </div>
                  <div className="mt-2 font-normal">
                    {weeklyTotals[index].totalHours}h / {MAX_HOURS_PER_WEEK}h (
                    {weeklyTotals[index].percentage}%)
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {timesheetData.length === 0 ? (
            <tr>
              <td
                colSpan={weekRanges.length + 1}
                className="py-12 text-center text-gray-500"
              >
                No tasks added yet. Click "Add tasks" to get started.
              </td>
            </tr>
          ) : (
            timesheetData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border-b py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        'transition-colors',
                        canEditWeek(selectedWeekIndex)
                          ? 'text-red-400 hover:text-red-600'
                          : 'cursor-not-allowed text-gray-300',
                      )}
                      onClick={() =>
                        canEditWeek(selectedWeekIndex) && onRemoveTask(row.id)
                      }
                      title="Remove task"
                      disabled={!canEditWeek(selectedWeekIndex)}
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
                  <div className="ml-6 text-xs text-gray-400">{row.taskCode}</div>
                </td>
                {row.weeklyData.map((data, weekIndex) => {
                  const canEdit = canEditWeek(weekIndex);
                  const isSelected = weekIndex === selectedWeekIndex;

                  return (
                    <td
                      key={weekIndex}
                      className={cn(
                        'border-b px-3 py-3 text-center text-sm',
                        weekRanges[weekIndex]?.isCurrentWeek && 'bg-blue-50/50',
                        isSelected && 'bg-slate-50',
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
                        disabled={!canEdit}
                        className={cn(
                          'w-16 rounded border px-2 py-1 text-center text-sm focus:outline-none',
                          canEdit
                            ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                            : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500',
                        )}
                        placeholder="0"
                      />
                      <span className="ml-1 text-gray-500">h</span>
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
