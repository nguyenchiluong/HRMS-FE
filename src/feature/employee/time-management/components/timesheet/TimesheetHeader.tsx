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
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import {
  AVAILABLE_PROJECTS,
  getMonthName,
  getStatusConfig,
} from '../../store/useTimesheetStore';
import {
  StatusConfig,
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
  status: TimesheetStatus;
  isEditing: boolean;
  showProjectDropdown: boolean;
  timesheetData: TimesheetRow[];
  weekRanges: WeekRange[];
  onToggleDropdown: () => void;
  onAddProject: (projectId: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthYearChange: (month: number, year: number) => void;
  onSubmit: () => void;
  onAdjust: () => void;
}

export const TimesheetHeader: React.FC<TimesheetHeaderProps> = ({
  currentMonth,
  currentYear,
  status,
  isEditing,
  showProjectDropdown,
  timesheetData,
  onToggleDropdown,
  onAddProject,
  onPreviousMonth,
  onNextMonth,
  onMonthYearChange,
  onSubmit,
  onAdjust,
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

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Add Tasks Button with Dropdown */}
        <div className="relative">
          <Button onClick={onToggleDropdown} disabled={!isEditing}>
            Add tasks
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>

          {showProjectDropdown && isEditing && (
            <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border bg-white shadow-lg">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                  Available Projects
                </div>
                {AVAILABLE_PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => onAddProject(project.id)}
                    disabled={timesheetData.some(
                      (row) => row.name === project.name,
                    )}
                  >
                    {project.name}
                    {timesheetData.some((row) => row.name === project.name) && (
                      <span className="ml-2 text-xs text-gray-400">
                        (Added)
                      </span>
                    )}
                  </button>
                ))}
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

        {/* Status Tag */}
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

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onAdjust}
          disabled={isEditing}
          className="border-gray-300"
        >
          Adjust
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isEditing || status === 'approved'}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
