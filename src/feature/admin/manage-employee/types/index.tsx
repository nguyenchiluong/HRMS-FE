export const EmployeeStatus = {
  Active: 'Active',
  Pending: 'Pending',
  Inactive: 'Inactive',
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export interface Employee {
  id: string;
  fullName: string;
  workEmail: string;
  position: string;
  jobLevel: string;
  department: string;
  status: EmployeeStatus;
  employmentType: string;
  timeType: string;
}

export interface EmployeeStats {
  total: number;
  onboarding: number;
  resigned: number;
  managers: number;
}

export interface FilterState {
  searchTerm: string;
  status: EmployeeStatus[];
  department: string[];
  position: string[];
  jobLevel: string[];
  employmentType: string[];
  timeType: string[];
}
