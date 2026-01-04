import { create } from 'zustand';
import type { TimesheetRow, WeekRange } from '../types';

// Constants
export const MAX_HOURS_PER_WEEK = 40;

// Helper functions
export const getWeeksInMonth = (year: number, month: number): WeekRange[] => {
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
      startDate: weekStart,
      endDate: weekEnd,
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;

    if (weeks.length >= 4) break;
  }

  return weeks;
};

export const getMonthName = (month: number): string => {
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

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'Approved',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
      };
    case 'PENDING':
      return {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
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

/**
 * UI State Store for Timesheet
 * Data fetching is handled by react-query hooks
 */
interface TimesheetUIStore {
  // UI State
  currentDate: Date;
  selectedWeekIndex: number;
  showProjectDropdown: boolean;

  // Local edits (before submission)
  localEdits: TimesheetRow[];
  hasLocalEdits: boolean;

  // Actions
  setCurrentDate: (date: Date) => void;
  setSelectedWeekIndex: (index: number) => void;
  setShowProjectDropdown: (show: boolean) => void;

  // Local edit actions
  initializeLocalEdits: (rows: TimesheetRow[]) => void;
  addTask: (
    taskId: number,
    taskCode: string,
    taskName: string,
    taskType: 'project' | 'leave',
    weekRanges: WeekRange[],
  ) => void;
  removeTask: (taskId: string) => void;
  updateHours: (
    rowId: string,
    weekIndex: number,
    hours: number,
    weekStatus: string,
  ) => void;
  resetLocalEdits: () => void;

  // Navigation
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export const useTimesheetStore = create<TimesheetUIStore>((set, get) => ({
  // Initial state
  currentDate: new Date(),
  selectedWeekIndex: 0,
  showProjectDropdown: false,
  localEdits: [],
  hasLocalEdits: false,

  // Basic setters
  setCurrentDate: (date) => set({ currentDate: date, localEdits: [], hasLocalEdits: false }),
  setSelectedWeekIndex: (index) => set({ selectedWeekIndex: index }),
  setShowProjectDropdown: (show) => set({ showProjectDropdown: show }),

  // Local edit actions
  initializeLocalEdits: (rows) => set({ localEdits: rows, hasLocalEdits: false }),

  addTask: (taskId, taskCode, taskName, taskType, weekRanges) => {
    const { localEdits } = get();

    // Check if task already exists
    if (localEdits.some((row) => row.taskId === taskId)) {
      set({ showProjectDropdown: false });
      return;
    }

    const newRow: TimesheetRow = {
      id: `task-${taskId}-${Date.now()}`,
      taskId,
      taskCode,
      name: taskName,
      type: taskType,
      weeklyData: weekRanges.map(() => ({ hours: 0 })),
    };

    set({
      localEdits: [...localEdits, newRow],
      showProjectDropdown: false,
      hasLocalEdits: true,
    });
  },

  removeTask: (taskId) => {
    const { localEdits } = get();
    set({
      localEdits: localEdits.filter((row) => row.id !== taskId),
      hasLocalEdits: true,
    });
  },

  updateHours: (rowId, weekIndex, hours, weekStatus) => {
    // Only allow editing for DRAFT, REJECTED, or CANCELLED weeks
    if (weekStatus !== 'DRAFT' && weekStatus !== 'REJECTED' && weekStatus !== 'CANCELLED') return;

    const { localEdits } = get();
    set({
      localEdits: localEdits.map((row) => {
        if (row.id === rowId) {
          const newWeeklyData = [...row.weeklyData];
          newWeeklyData[weekIndex] = {
            ...newWeeklyData[weekIndex],
            hours: Math.max(0, Math.min(hours, MAX_HOURS_PER_WEEK)),
          };
          return { ...row, weeklyData: newWeeklyData };
        }
        return row;
      }),
      hasLocalEdits: true,
    });
  },

  resetLocalEdits: () => set({ localEdits: [], hasLocalEdits: false }),

  goToPreviousMonth: () => {
    const { currentDate } = get();
    set({
      currentDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      ),
      localEdits: [],
      hasLocalEdits: false,
    });
  },

  goToNextMonth: () => {
    const { currentDate } = get();
    set({
      currentDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1,
      ),
      localEdits: [],
      hasLocalEdits: false,
    });
  },
}));
