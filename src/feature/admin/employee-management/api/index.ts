/**
 * Admin Employee Management Feature API
 * Uses .NET backend (dotnetApi)
 */

import dotnetApi from '@/api/dotnet';
import type {
  Department,
  InitialProfilePayload,
  Position,
} from '@/types/employee';

export const getPositions = async (): Promise<Position[]> => {
  const response = await dotnetApi.get('/api/Positions');
  return response.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await dotnetApi.get('/api/Departments');
  return response.data;
};

export const createInitialProfile = async (
  data: InitialProfilePayload,
): Promise<void> => {
  await dotnetApi.post('/api/Employees/initial-profile', data);
};

