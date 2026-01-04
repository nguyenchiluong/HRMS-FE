/**
 * Custom hooks for lookup data (departments, positions, job levels, etc.)
 */

import { useQuery } from '@tanstack/react-query';
import { 
  getDepartments, 
  getPositions, 
  getJobLevels, 
  getEmploymentTypes, 
  getTimeTypes 
} from '../api';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: getPositions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useJobLevels = () => {
  return useQuery({
    queryKey: ['jobLevels'],
    queryFn: getJobLevels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEmploymentTypes = () => {
  return useQuery({
    queryKey: ['employmentTypes'],
    queryFn: getEmploymentTypes,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTimeTypes = () => {
  return useQuery({
    queryKey: ['timeTypes'],
    queryFn: getTimeTypes,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
