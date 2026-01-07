export interface Position {
  id: number;
  title: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface JobLevel {
  id: number;
  name: string;
}

export interface EmploymentType {
  id: number;
  name: string;
}

export interface TimeType {
  id: number;
  name: string;
}

export interface InitialProfileFormData {
  fullName: string;
  personalEmail: string;
  positionId: number | '';
  jobLevelId: number | '';
  departmentId: number | '';
  employmentTypeId: number | '';
  timeTypeId: number | '';
  startDate: string;
  managerId: number | '';
  hrId: number | '';
}

export interface InitialProfilePayload {
  fullName: string;
  personalEmail: string;
  positionId: number;
  jobLevelId: number;
  departmentId: number;
  employmentTypeId: number;
  timeTypeId: number;
  startDate: string;
  managerId?: number | null;
  hrId?: number | null;
}
