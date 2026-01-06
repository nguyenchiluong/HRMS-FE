import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { getMonthName, getStatusConfig } from '../../store/useTimesheetStore';
import type {
  StatusConfig,
  Task,
  TimesheetRow,
  TimesheetStatus,
  WeekRange,
} from '../../types';

const MONTHS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

// Generate years from 2020 to 2030
const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

interface TimesheetHeaderProps {
  currentMonth: number;
  currentYear: number;
  selectedWeekIndex: number;
  status: TimesheetStatus;
  isSubmitting: boolean;
  showProjectDropdown: boolean;
  timesheetData: TimesheetRow[];
  weekRanges: WeekRange[];
  availableTasks: Task[];
  onToggleDropdown: () => void;
  onAddTask: (task: Task) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthYearChange: (month: number, year: number) => void;
  onSubmit: () => void;
  onAdjust: () => void;
  onCancel?: () => void;
  canEdit: boolean;
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({
  currentMonth,
  currentYear,
  selectedWeekIndex,
  status,
  isSubmitting,
  showProjectDropdown,
  timesheetData,
  weekRanges,
  availableTasks,
  onToggleDropdown,
  onAddTask,
  onPreviousMonth,
  onNextMonth,
  onMonthYearChange,
  onSubmit,
  onAdjust,
  onCancel,
  canEdit,
}) => {
  const statusConfig: StatusConfig = getStatusConfig(status);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleApply = () => {
    onMonthYearChange(selectedMonth, selectedYear);
    setIsMonthPickerOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Reset to current values when opening
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
    }
    setIsMonthPickerOpen(open);
  };

  // Filter out tasks that are already added
  const availableToAdd = availableTasks.filter(
    (task) => !timesheetData.some((row) => row.taskId === task.id),
  );

  const currentWeek = weekRanges[selectedWeekIndex];
  const weekLabel = currentWeek
    ? `Week ${currentWeek.weekNumber} (${currentWeek.start} - ${currentWeek.end})`
    : '';

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Add Tasks Button with Dropdown */}
        <div className="relative">
          <Button onClick={onToggleDropdown} disabled={!canEdit || isSubmitting}>
            Add tasks
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>

          {showProjectDropdown && canEdit && (
            <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border bg-white shadow-lg">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                  Available Tasks
                </div>
                {availableToAdd.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">
                    All tasks added
                  </div>
                ) : (
                  availableToAdd.map((task) => (
                    <button
                      key={task.id}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={() => onAddTask(task)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{task.taskName}</span>
                        {task.taskType === 'leave' && (
                          <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">
                            Leave
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{task.taskCode}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover open={isMonthPickerOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <button className="min-w-[140px] cursor-pointer rounded-md px-2 py-1 text-center text-sm font-medium transition-colors hover:bg-gray-100">
                {getMonthName(currentMonth)} {currentYear}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="center">
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-700">
                  Select Month & Year
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Month</label>
                    <Select
                      value={selectedMonth.toString()}
                      onValueChange={(val) => setSelectedMonth(parseInt(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Year</label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(val) => setSelectedYear(parseInt(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMonthPickerOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Info & Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{weekLabel}</span>
          <div
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium',
              statusConfig.bgColor,
              statusConfig.textColor,
              statusConfig.borderColor,
            )}
          >
            {statusConfig.label}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {status === 'REJECTED' && (
          <Button
            variant="outline"
            onClick={onAdjust}
            disabled={isSubmitting}
            className="border-gray-300"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Adjust & Resubmit
          </Button>
        )}
        {(status === 'DRAFT' || status === 'REJECTED' || status === 'CANCELLED') && (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || status === 'APPROVED'}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Submit Week {weekRanges[selectedWeekIndex]?.weekNumber}
          </Button>
        )}
        {status === 'PENDING' && (
          <>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-gray-300"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Cancel
              </Button>
            )}
            <span className="text-sm text-gray-500">
              Awaiting manager approval
            </span>
          </>
        )}
        {status === 'APPROVED' && (
          <span className="text-sm text-green-600">
            ✓ Week approved
          </span>
        )}
      </div>
    </div>
  );
};
