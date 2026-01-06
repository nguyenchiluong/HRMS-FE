import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { ProgressBar } from '../components/timesheet/ProgressBar';
import { TimesheetHeader } from '../components/timesheet/TimesheetHeader';
import { TimesheetTable } from '../components/timesheet/TimesheetTable';
import {
  getWeekSubmissions,
  transformTimesheetsToRows,
  useActiveTasks,
  useAdjustTimesheet,
  useCancelTimesheet,
  useMyTimesheets,
  useSubmitTimesheet,
  type WeekSubmission,
} from '../hooks/useTimesheet';
import {
  getWeeksInMonth,
  MAX_HOURS_PER_WEEK,
  useTimesheetStore,
} from '../store/useTimesheetStore';
import type { Task, TimesheetStatus } from '../types';

export default function Timesheet() {
  const {
    currentDate,
    selectedWeekIndex,
    showProjectDropdown,
    localEdits,
    hasLocalEdits,
    setShowProjectDropdown,
    setCurrentDate,
    setSelectedWeekIndex,
    addTask,
    removeTask,
    updateHours,
    initializeLocalEdits,
    goToPreviousMonth,
    goToNextMonth,
  } = useTimesheetStore();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const weekRanges = useMemo(() => {
    return getWeeksInMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // React Query hooks
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
  } = useActiveTasks();

  const {
    data: timesheetsResponse,
    isLoading: isLoadingTimesheets,
  } = useMyTimesheets(currentYear, currentMonth + 1); // API uses 1-based months

  const { mutate: submitTimesheet, isPending: isSubmitting } = useSubmitTimesheet(
    currentYear,
    currentMonth + 1,
  );

  const { mutate: adjustTimesheet, isPending: isAdjusting } = useAdjustTimesheet(
    currentYear,
    currentMonth + 1,
  );

  const { mutate: cancelTimesheet, isPending: isCancelling } = useCancelTimesheet(
    currentYear,
    currentMonth + 1,
  );

  const isLoading = isLoadingTasks || isLoadingTimesheets;
  const isMutating = isSubmitting || isAdjusting || isCancelling;

  // Transform API data to UI format
  const timesheetData = useMemo(() => {
    if (!timesheetsResponse?.data || !tasks.length) return [];
    return transformTimesheetsToRows(timesheetsResponse.data, tasks, weekRanges);
  }, [timesheetsResponse?.data, tasks, weekRanges]);

  // Week submissions status
  const weekSubmissions: WeekSubmission[] = useMemo(() => {
    if (!timesheetsResponse?.data) {
      return weekRanges.map((week) => ({
        weekNumber: week.weekNumber,
        status: 'DRAFT' as const,
      }));
    }
    return getWeekSubmissions(timesheetsResponse.data, weekRanges);
  }, [timesheetsResponse?.data, weekRanges]);

  // Initialize local edits when data changes (only if not already modified by user)
  useEffect(() => {
    if (timesheetData.length > 0 && !hasLocalEdits) {
      initializeLocalEdits(timesheetData);
    }
  }, [timesheetData, hasLocalEdits, initializeLocalEdits]);

  // Determine current week index based on today's date
  useEffect(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    if (currentYear === todayYear && currentMonth === todayMonth) {
      const todayDate = today.getDate();
      const weekIndex = weekRanges.findIndex(
        (week) =>
          todayDate >= parseInt(week.start.split('/')[1]) &&
          todayDate <= parseInt(week.end.split('/')[1]),
      );
      if (weekIndex >= 0) {
        setSelectedWeekIndex(weekIndex);
      }
    } else {
      setSelectedWeekIndex(0);
    }
  }, [weekRanges, currentYear, currentMonth, setSelectedWeekIndex]);

  // Use local edits if they exist or if user has made edits (even if empty), otherwise use transformed data
  const displayData = hasLocalEdits ? localEdits : (localEdits.length > 0 ? localEdits : timesheetData);

  // Calculate total hours per week (excluding Leave)
  const weeklyTotals = useMemo(() => {
    return weekRanges.map((_, weekIndex) => {
      const totalHours = displayData
        .filter((row) => row.type !== 'leave')
        .reduce((sum, row) => sum + (row.weeklyData[weekIndex]?.hours || 0), 0);
      const percentage = Math.min(
        Math.round((totalHours / MAX_HOURS_PER_WEEK) * 100),
        100,
      );
      return { totalHours, percentage };
    });
  }, [displayData, weekRanges]);

  // Get current week's progress
  const currentWeekProgress = useMemo(() => {
    return weeklyTotals[selectedWeekIndex]?.percentage || 0;
  }, [weeklyTotals, selectedWeekIndex]);

  // Get current week's status
  const currentWeekStatus = useMemo(() => {
    return (weekSubmissions[selectedWeekIndex]?.status || 'DRAFT') as TimesheetStatus;
  }, [weekSubmissions, selectedWeekIndex]);

  const getWeekStatus = useCallback(
    (weekIndex: number): TimesheetStatus => {
      return (weekSubmissions[weekIndex]?.status || 'DRAFT') as TimesheetStatus;
    },
    [weekSubmissions],
  );

  const canEditWeek = useCallback(
    (weekIndex: number): boolean => {
      const status = getWeekStatus(weekIndex);
      return status === 'DRAFT' || status === 'REJECTED' || status === 'CANCELLED';
    },
    [getWeekStatus],
  );

  const handleToggleDropdown = useCallback(() => {
    setShowProjectDropdown(!showProjectDropdown);
  }, [showProjectDropdown, setShowProjectDropdown]);

  const handleAddTask = useCallback(
    (task: Task) => {
      addTask(task.id, task.taskCode, task.taskName, task.taskType, weekRanges);
    },
    [addTask, weekRanges],
  );

  const handleMonthYearChange = useCallback(
    (month: number, year: number) => {
      setCurrentDate(new Date(year, month, 1));
    },
    [setCurrentDate],
  );

  const handleHoursChange = useCallback(
    (rowId: string, weekIndex: number, hours: number) => {
      updateHours(rowId, weekIndex, hours, getWeekStatus(weekIndex));
    },
    [updateHours, getWeekStatus],
  );

  const handleSubmit = useCallback(() => {
    const week = weekRanges[selectedWeekIndex];
    if (!week) return;

    // Collect entries for this week
    const entries = displayData
      .filter((row) => row.weeklyData[selectedWeekIndex]?.hours > 0)
      .map((row) => ({
        taskId: row.taskId,
        entryType: row.type,
        hours: row.weeklyData[selectedWeekIndex].hours,
      }));

    if (entries.length === 0) {
      return;
    }

    submitTimesheet({
      year: currentYear,
      month: currentMonth + 1,
      weekNumber: week.weekNumber,
      weekStartDate: week.startDate.toISOString(),
      weekEndDate: week.endDate.toISOString(),
      reason: `Weekly timesheet for Week ${week.weekNumber}`,
      entries,
    });
  }, [displayData, currentYear, currentMonth, selectedWeekIndex, weekRanges, submitTimesheet]);

  const handleAdjust = useCallback(() => {
    const week = weekRanges[selectedWeekIndex];
    const submission = weekSubmissions[selectedWeekIndex];

    if (!week || !submission?.requestId) return;

    const entries = displayData
      .filter((row) => row.weeklyData[selectedWeekIndex]?.hours > 0)
      .map((row) => ({
        taskId: row.taskId,
        entryType: row.type,
        hours: row.weeklyData[selectedWeekIndex].hours,
      }));

    adjustTimesheet({
      requestId: submission.requestId,
      data: {
        reason: 'Adjusted timesheet',
        entries,
      },
    });
  }, [displayData, selectedWeekIndex, weekRanges, weekSubmissions, adjustTimesheet]);

  const handleCancel = useCallback(() => {
    const submission = weekSubmissions[selectedWeekIndex];

    if (!submission?.requestId) return;

    cancelTimesheet(submission.requestId);
  }, [selectedWeekIndex, weekSubmissions, cancelTimesheet]);

  const handleSelectWeek = useCallback(
    (weekIndex: number) => {
      setSelectedWeekIndex(weekIndex);
    },
    [setSelectedWeekIndex],
  );

  if (isLoading && displayData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="p-6">
        <TimesheetHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          selectedWeekIndex={selectedWeekIndex}
          status={currentWeekStatus}
          isSubmitting={isMutating}
          showProjectDropdown={showProjectDropdown}
          timesheetData={displayData}
          weekRanges={weekRanges}
          availableTasks={tasks}
          onToggleDropdown={handleToggleDropdown}
          onAddTask={handleAddTask}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onMonthYearChange={handleMonthYearChange}
          onSubmit={handleSubmit}
          onAdjust={handleAdjust}
          onCancel={handleCancel}
          canEdit={canEditWeek(selectedWeekIndex)}
        />

        <ProgressBar progress={currentWeekProgress} />

        <TimesheetTable
          timesheetData={displayData}
          weekRanges={weekRanges}
          weeklyTotals={weeklyTotals}
          selectedWeekIndex={selectedWeekIndex}
          onSelectWeek={handleSelectWeek}
          onRemoveTask={removeTask}
          onHoursChange={handleHoursChange}
          getWeekStatus={getWeekStatus}
          canEditWeek={canEditWeek}
        />
      </Card>
    </div>
  );
}
