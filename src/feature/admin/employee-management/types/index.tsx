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

export interface Position {
  id: number;
  title: string;
}
export interface Department {
  id: number;
  name: string;
}
export type JobLevel =
  | 'Intern'
  | 'Fresher'
  | 'Junior'
  | 'Middle'
  | 'Senior'
  | 'Lead'
  | 'Manager';
export type EmployeeType = 'FullTime' | 'PartTime' | 'Contract' | 'Intern';
export type TimeType = 'OnSite' | 'Remote' | 'Hybrid';
export interface InitialProfileFormData {
  fullName: string;
  personalEmail: string;
  positionId: number | '';
  jobLevel: JobLevel | '';
  departmentId: number | '';
  employeeType: EmployeeType | '';
  timeType: TimeType | '';
  startDate: string;
}
export interface InitialProfilePayload {
  fullName: string;
  personalEmail: string;
  positionId: number;
  jobLevel: string;
  departmentId: number;
  employeeType: string;
  timeType: string;
  startDate: string;
}
