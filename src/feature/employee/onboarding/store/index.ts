import { create } from 'zustand';
import { JobDetails } from '../types';

interface EmployeeOnboardingState {
  employeeId: number;
  currentUser: {
    name: string;
  };
  jobDetails: JobDetails;
  setEmployeeId: (id: number) => void;
  setJobDetails: (details: JobDetails) => void;
}

export const EmployeeOnboardingStore = create<EmployeeOnboardingState>(
  (set) => ({
    employeeId: 2, // Default employee ID, should be set from route params or auth
    currentUser: {
      name: 'Nguyen Tuan Kiet',
    },
    jobDetails: {
      position: 'Software Engineer',
      jobLevel: 'Junior',
      department: 'IT Banking Department',
      employeeType: 'Fixed Term',
      timeType: 'Full-time',
      onboardDate: '25/12/2025',
    },
    setEmployeeId: (id) => set({ employeeId: id }),
    setJobDetails: (details) => set({ jobDetails: details }),
  }),
);
