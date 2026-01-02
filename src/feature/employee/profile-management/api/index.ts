/**
 * Profile Management API
 * 
 * Handles employee profile-related API calls
 */

import { dotnetApi } from '@/api';
import { EmployeeDto, UpdateProfileDto } from '../types';

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
