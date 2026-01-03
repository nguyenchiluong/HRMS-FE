/**
 * Profile Management API
 * 
 * Handles employee profile-related API calls
 */

import { dotnetApi } from '@/api';
import { EmployeeDto, UpdateProfileDto, EducationRecordDto, CreateEducationDto, UpdateEducationDto } from '../types';

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
