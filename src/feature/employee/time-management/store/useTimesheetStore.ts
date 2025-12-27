import { create } from 'zustand';
import {
  AvailableProject,
  TimesheetRow,
  TimesheetStatus,
  WeekRange,
} from '../types';

// Constants
export const MAX_HOURS_PER_WEEK = 40;

export const AVAILABLE_PROJECTS: AvailableProject[] = [
  { id: 'daily-study', name: 'Daily Study', type: 'project' },
  { id: 'technical-research', name: 'Technical Research', type: 'project' },
  { id: 'client-project-a', name: 'Client Project A', type: 'project' },
  { id: 'internal-tools', name: 'Internal Tools', type: 'project' },
  { id: 'training', name: 'Training & Development', type: 'project' },
  { id: 'leave', name: 'Leave', type: 'leave' },
];

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

export const getStatusConfig = (status: TimesheetStatus) => {
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

// Initial mock data
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

interface TimesheetStore {
  // State
  timesheetData: TimesheetRow[];
  currentDate: Date;
  status: TimesheetStatus;
  isEditing: boolean;
  showProjectDropdown: boolean;

  // Actions
  setTimesheetData: (data: TimesheetRow[]) => void;
  setCurrentDate: (date: Date) => void;
  setStatus: (status: TimesheetStatus) => void;
  setIsEditing: (isEditing: boolean) => void;
  setShowProjectDropdown: (show: boolean) => void;

  // Business logic actions
  addProject: (projectId: string, weekRanges: WeekRange[]) => void;
  removeTask: (taskId: string) => void;
  updateHours: (rowId: string, weekIndex: number, hours: number) => void;
  submitTimesheet: () => void;
  adjustTimesheet: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export const useTimesheetStore = create<TimesheetStore>((set, get) => ({
  // Initial state
  timesheetData: initialTimesheetData,
  currentDate: new Date(),
  status: 'draft',
  isEditing: true,
  showProjectDropdown: false,

  // Basic setters
  setTimesheetData: (data) => set({ timesheetData: data }),
  setCurrentDate: (date) => set({ currentDate: date }),
  setStatus: (status) => set({ status }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setShowProjectDropdown: (show) => set({ showProjectDropdown: show }),

  // Business logic
  addProject: (projectId, weekRanges) => {
    const { timesheetData } = get();
    const project = AVAILABLE_PROJECTS.find((p) => p.id === projectId);
    if (!project) return;

    // Check if project already exists
    if (timesheetData.some((row) => row.name === project.name)) {
      set({ showProjectDropdown: false });
      return;
    }

    const newRow: TimesheetRow = {
      id: Date.now().toString(),
      name: project.name,
      type: project.type,
      weeklyData: weekRanges.map(() => ({ hours: 0 })),
    };

    set({
      timesheetData: [...timesheetData, newRow],
      showProjectDropdown: false,
    });
  },

  removeTask: (taskId) => {
    const { timesheetData } = get();
    set({ timesheetData: timesheetData.filter((row) => row.id !== taskId) });
  },

  updateHours: (rowId, weekIndex, hours) => {
    const { timesheetData, isEditing } = get();
    if (!isEditing) return;

    set({
      timesheetData: timesheetData.map((row) => {
        if (row.id === rowId) {
          const newWeeklyData = [...row.weeklyData];
          newWeeklyData[weekIndex] = {
            hours: Math.max(0, Math.min(hours, MAX_HOURS_PER_WEEK)),
          };
          return { ...row, weeklyData: newWeeklyData };
        }
        return row;
      }),
    });
  },

  submitTimesheet: () => {
    set({ status: 'submitted', isEditing: false });
  },

  adjustTimesheet: () => {
    set({ isEditing: true, status: 'draft' });
  },

  goToPreviousMonth: () => {
    const { currentDate } = get();
    set({
      currentDate: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1,
      ),
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
    });
  },
}));
