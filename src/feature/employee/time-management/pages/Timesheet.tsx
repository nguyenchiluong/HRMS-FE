import { Card } from '@/components/ui/card';
import { useMemo } from 'react';
import { ProgressBar } from '../components/timesheet/ProgressBar';
import { TimesheetHeader } from '../components/timesheet/TimesheetHeader';
import { TimesheetTable } from '../components/timesheet/TimesheetTable';
import {
  getWeeksInMonth,
  MAX_HOURS_PER_WEEK,
  useTimesheetStore,
} from '../store/useTimesheetStore';

export default function Timesheet() {
  const {
    timesheetData,
    currentDate,
    status,
    isEditing,
    showProjectDropdown,
    setShowProjectDropdown,
    setCurrentDate,
    addProject,
    removeTask,
    updateHours,
    submitTimesheet,
    adjustTimesheet,
    goToPreviousMonth,
    goToNextMonth,
  } = useTimesheetStore();

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

  // Determine current week index based on today's date
  const currentWeekIndex = useMemo(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    // If viewing a different month, default to first week
    if (currentYear !== todayYear || currentMonth !== todayMonth) {
      return 0;
    }

    const todayDate = today.getDate();
    const weekIndex = weekRanges.findIndex(
      (week) => todayDate >= Number(week.start) && todayDate <= Number(week.end),
    );
    return weekIndex >= 0 ? weekIndex : 0;
  }, [weekRanges, currentYear, currentMonth]);

  // Get current week's progress
  const currentWeekProgress = useMemo(() => {
    return weeklyTotals[currentWeekIndex]?.percentage || 0;
  }, [weeklyTotals, currentWeekIndex]);

  const handleToggleDropdown = () => {
    setShowProjectDropdown(!showProjectDropdown);
  };

  const handleAddProject = (projectId: string) => {
    addProject(projectId, weekRanges);
  };

  const handleMonthYearChange = (month: number, year: number) => {
    setCurrentDate(new Date(year, month, 1));
  };

  return (
    <div className="w-full">
      <Card className="p-6">
        <TimesheetHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          status={status}
          isEditing={isEditing}
          showProjectDropdown={showProjectDropdown}
          timesheetData={timesheetData}
          weekRanges={weekRanges}
          onToggleDropdown={handleToggleDropdown}
          onAddProject={handleAddProject}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onMonthYearChange={handleMonthYearChange}
          onSubmit={submitTimesheet}
          onAdjust={adjustTimesheet}
        />

        <ProgressBar progress={currentWeekProgress} />

        <TimesheetTable
          timesheetData={timesheetData}
          weekRanges={weekRanges}
          weeklyTotals={weeklyTotals}
          isEditing={isEditing}
          onRemoveTask={removeTask}
          onHoursChange={updateHours}
        />
      </Card>
    </div>
  );
}
