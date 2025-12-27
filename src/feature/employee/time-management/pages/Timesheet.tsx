import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { useMemo, useState } from 'react';

interface TimesheetRow {
  id: string;
  name: string;
  type: 'project' | 'leave';
  weeklyData: {
    hours: number;
  }[];
}

interface WeekRange {
  start: string;
  end: string;
  weekNumber: number;
  isCurrentWeek: boolean;
}

const availableProjects = [
  { id: 'daily-study', name: 'Daily Study', type: 'project' as const },
  {
    id: 'technical-research',
    name: 'Technical Research',
    type: 'project' as const,
  },
  {
    id: 'client-project-a',
    name: 'Client Project A',
    type: 'project' as const,
  },
  { id: 'internal-tools', name: 'Internal Tools', type: 'project' as const },
  { id: 'training', name: 'Training & Development', type: 'project' as const },
  { id: 'leave', name: 'Leave', type: 'leave' as const },
];

const getWeeksInMonth = (year: number, month: number): WeekRange[] => {
  const weeks: WeekRange[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Find the Monday of the first week
  const currentDate = new Date(firstDay);
  const dayOfWeek = currentDate.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentDate.setDate(currentDate.getDate() + diff);

  const today = new Date();
  let weekNumber = 1;

  while (currentDate <= lastDay || weeks.length < 4) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const isCurrentWeek = today >= weekStart && today <= weekEnd;

    weeks.push({
      start: `${(weekStart.getMonth() + 1).toString().padStart(2, '0')}/${weekStart.getDate().toString().padStart(2, '0')}`,
      end: `${(weekEnd.getMonth() + 1).toString().padStart(2, '0')}/${weekEnd.getDate().toString().padStart(2, '0')}`,
      weekNumber,
      isCurrentWeek,
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;

    if (weeks.length >= 4) break;
  }

  return weeks;
};

const getMonthName = (month: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
};

const initialTimesheetData: TimesheetRow[] = [
  {
    id: '1',
    name: 'Daily Study',
    type: 'project',
    weeklyData: [{ hours: 40 }, { hours: 40 }, { hours: 0 }, { hours: 0 }],
  },
  {
    id: '2',
    name: 'Technical Research',
    type: 'project',
    weeklyData: [{ hours: 0 }, { hours: 0 }, { hours: 32 }, { hours: 32 }],
  },
  {
    id: '3',
    name: 'Leave',
    type: 'leave',
    weeklyData: [{ hours: 0 }, { hours: 0 }, { hours: 8 }, { hours: 8 }],
  },
];

const MAX_HOURS_PER_WEEK = 40;

type TimesheetStatus = 'draft' | 'submitted' | 'approved';

export default function Timesheet() {
  const [timesheetData, setTimesheetData] =
    useState<TimesheetRow[]>(initialTimesheetData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [status, setStatus] = useState<TimesheetStatus>('draft');
  const [isEditing, setIsEditing] = useState(true);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const weekRanges = useMemo(() => {
    return getWeeksInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Calculate total hours per week (excluding Leave)
  const weeklyTotals = useMemo(() => {
    return weekRanges.map((_, weekIndex) => {
      const totalHours = timesheetData
        .filter((row) => row.type !== 'leave')
        .reduce((sum, row) => sum + (row.weeklyData[weekIndex]?.hours || 0), 0);
      const percentage = Math.min(
        Math.round((totalHours / MAX_HOURS_PER_WEEK) * 100),
        100,
      );
      return { totalHours, percentage };
    });
  }, [timesheetData, weekRanges]);

  // Calculate overall progress (average of all weeks)
  const overallProgress = useMemo(() => {
    const totalPercentage = weeklyTotals.reduce(
      (sum, week) => sum + week.percentage,
      0,
    );
    return Math.round(totalPercentage / weeklyTotals.length);
  }, [weeklyTotals]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleAddProject = (projectId: string) => {
    const project = availableProjects.find((p) => p.id === projectId);
    if (!project) return;

    // Check if project already exists
    if (timesheetData.some((row) => row.name === project.name)) {
      setShowProjectDropdown(false);
      return;
    }

    const newRow: TimesheetRow = {
      id: Date.now().toString(),
      name: project.name,
      type: project.type,
      weeklyData: weekRanges.map(() => ({ hours: 0 })),
    };

    setTimesheetData([...timesheetData, newRow]);
    setShowProjectDropdown(false);
  };

  const handleRemoveTask = (taskId: string) => {
    setTimesheetData(timesheetData.filter((row) => row.id !== taskId));
  };

  const handleHoursChange = (
    rowId: string,
    weekIndex: number,
    hours: number,
  ) => {
    if (!isEditing) return;
    setTimesheetData(
      timesheetData.map((row) => {
        if (row.id === rowId) {
          const newWeeklyData = [...row.weeklyData];
          newWeeklyData[weekIndex] = {
            hours: Math.max(0, Math.min(hours, MAX_HOURS_PER_WEEK)),
          };
          return { ...row, weeklyData: newWeeklyData };
        }
        return row;
      }),
    );
  };

  const handleSubmit = () => {
    setStatus('submitted');
    setIsEditing(false);
  };

  const handleAdjust = () => {
    setIsEditing(true);
    // If it was approved, we need to resubmit after adjustment
    if (status === 'approved') {
      setStatus('draft');
    } else if (status === 'submitted') {
      setStatus('draft');
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-300',
        };
      case 'submitted':
        return {
          label: 'Submitted',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-300',
        };
      default:
        return {
          label: 'Draft',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="w-full">
      <Card className="p-6">
        {/* Header Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Add Tasks Button with Dropdown */}
            <div className="relative">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                disabled={!isEditing}
              >
                Add tasks
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>

              {showProjectDropdown && isEditing && (
                <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border bg-white shadow-lg">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                      Available Projects
                    </div>
                    {availableProjects.map((project) => (
                      <button
                        key={project.id}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleAddProject(project.id)}
                        disabled={timesheetData.some(
                          (row) => row.name === project.name,
                        )}
                      >
                        {project.name}
                        {timesheetData.some(
                          (row) => row.name === project.name,
                        ) && (
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
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[140px] text-center text-sm font-medium">
                {getMonthName(currentMonth)} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextMonth}
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
              onClick={handleAdjust}
              disabled={isEditing}
              className="border-gray-300"
            >
              Adjust
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isEditing || status === 'approved'}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Monthly Working Hours Progress
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {overallProgress}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                overallProgress >= 100
                  ? 'bg-green-500'
                  : overallProgress >= 75
                    ? 'bg-blue-500'
                    : overallProgress >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-400',
              )}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Based on {MAX_HOURS_PER_WEEK} hours per week (excludes Leave)
          </p>
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
                      'min-w-[120px] border-b px-3 py-3 text-center text-xs',
                      week.isCurrentWeek && 'bg-yellow-100',
                    )}
                  >
                    <div className="font-medium">Week {week.weekNumber}</div>
                    <div className="text-gray-600">
                      {week.start} - {week.end}
                    </div>
                    <div className="mt-1 text-gray-500">
                      {weeklyTotals[index].totalHours}h / {MAX_HOURS_PER_WEEK}h
                      ({weeklyTotals[index].percentage}%)
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Data rows */}
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
                        onClick={() => isEditing && handleRemoveTask(row.id)}
                        title="Remove task"
                        disabled={!isEditing}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        className={cn(
                          row.type === 'leave' && 'text-orange-600',
                        )}
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
                        weekRanges[weekIndex]?.isCurrentWeek && 'bg-yellow-50',
                      )}
                    >
                      <input
                        type="number"
                        min="0"
                        max={MAX_HOURS_PER_WEEK}
                        value={data.hours}
                        onChange={(e) =>
                          handleHoursChange(
                            row.id,
                            weekIndex,
                            parseInt(e.target.value) || 0,
                          )
                        }
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
      </Card>
    </div>
  );
}
