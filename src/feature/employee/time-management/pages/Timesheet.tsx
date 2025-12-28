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

  // Calculate overall progress (average of all weeks)
  const overallProgress = useMemo(() => {
    const totalPercentage = weeklyTotals.reduce(
      (sum, week) => sum + week.percentage,
      0,
    );
    return Math.round(totalPercentage / weeklyTotals.length);
  }, [weeklyTotals]);

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

        <ProgressBar progress={overallProgress} />

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
