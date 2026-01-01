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
