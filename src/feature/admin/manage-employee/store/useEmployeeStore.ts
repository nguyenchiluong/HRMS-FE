import { create } from 'zustand';
import { Employee, EmployeeStats, EmployeeStatus } from '../types';

// Export constants for UI usage (Dropdowns, Filters, etc.)
export const DEPARTMENTS = [
  'Online Payment - Asia Area',
  'Product Design',
  'Engineering',
  'Marketing',
  'Sales',
];
export const POSITIONS = [
  'Full-stack Engineer',
  'Product Manager',
  'UX Designer',
  'Data Analyst',
  'Sales Executive',
];
export const JOB_LEVELS = ['L1-Junior', 'L2-Mid', 'L3-Senior', 'L4-Lead'];
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];
export const TIME_TYPES = ['On-site', 'Remote', 'Hybrid'];

// Mock Data Generation
const generateMockData = (): Employee[] => {
  const statuses = [
    EmployeeStatus.Active,
    EmployeeStatus.Pending,
    EmployeeStatus.Inactive,
  ];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `P0100${22 + i}`,
    fullName: i % 2 === 0 ? 'Nguyen Tuan Kiet' : 'Sarah Connor',
    workEmail:
      i % 2 === 0 ? 'kiet.nguyen@antman.com.us' : 'sarah.c@antman.com.us',
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    position: POSITIONS[i % POSITIONS.length],
    jobLevel: JOB_LEVELS[i % JOB_LEVELS.length],
    status: statuses[i % statuses.length],
    employmentType: EMPLOYMENT_TYPES[i % EMPLOYMENT_TYPES.length],
    timeType: TIME_TYPES[i % TIME_TYPES.length],
  }));
};

const MOCK_DATA = generateMockData();

const MOCK_STATS: EmployeeStats = {
  total: 500,
  onboarding: 15,
  resigned: 9,
  managers: 35,
};

interface EmployeeStore {
  employees: Employee[];
  stats: EmployeeStats | null;
  isLoading: boolean;
  fetchEmployees: () => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  stats: null,
  // Start loading true to prevent flash of empty content before fetch completes
  isLoading: true,

  fetchEmployees: async () => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({
      employees: MOCK_DATA,
      stats: MOCK_STATS,
      isLoading: false,
    });
  },
}));
