/**
 * Profile Management API
 * 
 * Handles employee profile-related API calls
 */

import { dotnetApi } from '@/api';
import { 
  EmployeeDto, 
  UpdateProfileDto, 
  EducationRecordDto, 
  CreateEducationDto, 
  UpdateEducationDto,
  BankAccountRecordDto,
  CreateBankAccountDto,
  UpdateBankAccountDto
} from '../types';
import type {
  Department,
  Position,
  JobLevel,
  EmploymentType,
  TimeType,
} from '@/types/employee';

/**
 * Gets the current authenticated employee's information from JWT token
 * @returns Promise with employee data
 */
export const getCurrentEmployee = async (): Promise<EmployeeDto> => {
  const response = await dotnetApi.get<EmployeeDto>('/api/employees/me');
  return response.data;
};

/**
 * Updates the current employee's personal information
 * Only the fields provided will be updated
 * @param data Partial employee data to update
 * @returns Promise with updated employee data
 */
export const updateCurrentEmployee = async (
  data: UpdateProfileDto
): Promise<EmployeeDto> => {
  const response = await dotnetApi.put<EmployeeDto>('/api/employees/me', data);
  return response.data;
};

// Education API

/**
 * Gets all education records for the authenticated user
 * @returns Promise with array of education records
 */
export const getMyEducations = async (): Promise<EducationRecordDto[]> => {
  const response = await dotnetApi.get<EducationRecordDto[]>('/api/education/me');
  return response.data;
};

/**
 * Gets a specific education record by ID
 * @param id The education record ID
 * @returns Promise with education record
 */
export const getMyEducation = async (id: number): Promise<EducationRecordDto> => {
  const response = await dotnetApi.get<EducationRecordDto>(`/api/education/me/${id}`);
  return response.data;
};

/**
 * Creates a new education record
 * @param data Education data to create
 * @returns Promise with created education record
 */
export const createMyEducation = async (
  data: CreateEducationDto
): Promise<EducationRecordDto> => {
  const response = await dotnetApi.post<EducationRecordDto>('/api/education/me', data);
  return response.data;
};

/**
 * Updates an existing education record
 * @param id The education record ID
 * @param data Education data to update
 * @returns Promise with updated education record
 */
export const updateMyEducation = async (
  id: number,
  data: UpdateEducationDto
): Promise<EducationRecordDto> => {
  const response = await dotnetApi.put<EducationRecordDto>(`/api/education/me/${id}`, data);
  return response.data;
};

/**
 * Deletes an education record
 * @param id The education record ID
 * @returns Promise<void>
 */
export const deleteMyEducation = async (id: number): Promise<void> => {
  await dotnetApi.delete(`/api/education/me/${id}`);
};

// Bank Account API

/**
 * Gets the bank account for the authenticated user (single account per employee)
 * API returns a list, but we only need the first item
 * @returns Promise with bank account record or null if not found
 */
export const getMyBankAccount = async (): Promise<BankAccountRecordDto | null> => {
  try {
    const response = await dotnetApi.get<BankAccountRecordDto[]>('/api/bankaccount/me');
    // Return the first item from the list, or null if list is empty
    return response.data && response.data.length > 0 ? response.data[0] : null;
  } catch (error: any) {
    // Return null if account doesn't exist (404) or list is empty
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a new bank account for the authenticated user
 * @param data Bank account data to create
 * @returns Promise with created bank account record
 */
export const createMyBankAccount = async (
  data: CreateBankAccountDto
): Promise<BankAccountRecordDto> => {
  const response = await dotnetApi.post<BankAccountRecordDto>(
    '/api/bankaccount/me',
    data
  );
  return response.data;
};

/**
 * Updates the bank account for the authenticated user
 * @param id The bank account ID (used as path parameter)
 * @param data Bank account data to update
 * @returns Promise with updated bank account record
 */
export const updateMyBankAccount = async (
  id: number,
  data: UpdateBankAccountDto
): Promise<BankAccountRecordDto> => {
  const response = await dotnetApi.put<BankAccountRecordDto>(
    `/api/bankaccount/me/${id}`,
    data
  );
  return response.data;
};

/**
 * Deletes the bank account for the authenticated user
 * @param id The bank account ID (used as path parameter)
 * @returns Promise<void>
 */
export const deleteMyBankAccount = async (id: number): Promise<void> => {
  await dotnetApi.delete(`/api/bankaccount/me/${id}`);
};

// Lookup APIs for reference data

/**
 * Gets all departments
 * @returns Promise with array of departments
 */
export const getDepartments = async (): Promise<Department[]> => {
  const response = await dotnetApi.get<Department[]>('/api/Departments');
  return response.data;
};

/**
 * Gets all positions
 * @returns Promise with array of positions
 */
export const getPositions = async (): Promise<Position[]> => {
  const response = await dotnetApi.get<Position[]>('/api/Positions');
  return response.data;
};

/**
 * Gets all job levels
 * @returns Promise with array of job levels
 */
export const getJobLevels = async (): Promise<JobLevel[]> => {
  const response = await dotnetApi.get<JobLevel[]>('/api/JobLevels');
  return response.data;
};

/**
 * Gets all employment types
 * @returns Promise with array of employment types
 */
export const getEmploymentTypes = async (): Promise<EmploymentType[]> => {
  const response = await dotnetApi.get<EmploymentType[]>('/api/EmploymentTypes');
  return response.data;
};

/**
 * Gets all time types
 * @returns Promise with array of time types
 */
export const getTimeTypes = async (): Promise<TimeType[]> => {
  const response = await dotnetApi.get<TimeType[]>('/api/TimeTypes');
  return response.data;
};
