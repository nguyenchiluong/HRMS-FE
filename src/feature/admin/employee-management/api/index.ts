/**
 * Admin Employee Management Feature API
 * Uses .NET backend (dotnetApi)
 */

import dotnetApi from '@/api/dotnet';
import type {
  Department,
  EmploymentType,
  InitialProfilePayload,
  JobLevel,
  Position,
  TimeType,
} from '@/types/employee';
import type { EmployeeDto } from '@/feature/employee/profile-management/types';
import type { Employee, EmployeeStats, FilterState } from '../types';

export interface GetEmployeesParams {
  searchTerm?: string;
  status?: string[];
  department?: string[];
  position?: string[];
  jobLevel?: string[];
  employmentType?: string[];
  timeType?: string[];
  page?: number;
  pageSize?: number;
}

export interface GetEmployeesResponse {
  data: Employee[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export const getEmployees = async (
  params: GetEmployeesParams = {},
): Promise<GetEmployeesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.searchTerm) {
    queryParams.append('searchTerm', params.searchTerm);
  }
  if (params.status && params.status.length > 0) {
    params.status.forEach((s) => queryParams.append('status', s));
  }
  if (params.department && params.department.length > 0) {
    params.department.forEach((d) => queryParams.append('department', d));
  }
  if (params.position && params.position.length > 0) {
    params.position.forEach((p) => queryParams.append('position', p));
  }
  if (params.jobLevel && params.jobLevel.length > 0) {
    params.jobLevel.forEach((j) => queryParams.append('jobLevel', j));
  }
  if (params.employmentType && params.employmentType.length > 0) {
    params.employmentType.forEach((e) =>
      queryParams.append('employmentType', e),
    );
  }
  if (params.timeType && params.timeType.length > 0) {
    params.timeType.forEach((t) => queryParams.append('timeType', t));
  }
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }

  const response = await dotnetApi.get<GetEmployeesResponse>(
    `/api/Employees?${queryParams.toString()}`,
  );
  return response.data;
};

export const getEmployeeStats = async (): Promise<EmployeeStats> => {
  const response = await dotnetApi.get<EmployeeStats>('/api/Employees/stats');
  return response.data;
};

export const getPositions = async (): Promise<Position[]> => {
  const response = await dotnetApi.get('/api/Positions');
  return response.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await dotnetApi.get('/api/Departments');
  return response.data;
};

export const getJobLevels = async (): Promise<JobLevel[]> => {
  const response = await dotnetApi.get('/api/JobLevels');
  return response.data;
};

export const getEmploymentTypes = async (): Promise<EmploymentType[]> => {
  const response = await dotnetApi.get('/api/EmploymentTypes');
  return response.data;
};

export const getTimeTypes = async (): Promise<TimeType[]> => {
  const response = await dotnetApi.get('/api/TimeTypes');
  return response.data;
};

export const createInitialProfile = async (
  data: InitialProfilePayload,
): Promise<void> => {
  await dotnetApi.post('/api/Employees/initial-profile', data);
};

/**
 * Get a single employee by ID
 * @param id Employee ID
 * @returns Promise with employee data
 */
export const getEmployeeById = async (id: number): Promise<EmployeeDto> => {
  const response = await dotnetApi.get<EmployeeDto>(`/api/employees/${id}`);
  return response.data;
};

