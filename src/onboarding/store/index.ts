import { JobDetails } from '@/onboarding/types';
import { create } from 'zustand';

interface EmployeeOnboardingState {
  currentUser: {
    name: string;
  };
  jobDetails: JobDetails;
  setJobDetails: (details: JobDetails) => void;
}

export const EmployeeOnboardingStore = create<EmployeeOnboardingState>(
  (set) => ({
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
    setJobDetails: (details) => set({ jobDetails: details }),
  }),
);
