/**
 * Custom hooks for education management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMyEducations, 
  getMyEducation, 
  createMyEducation, 
  updateMyEducation, 
  deleteMyEducation 
} from '../api';
import { CreateEducationDto, UpdateEducationDto } from '../types';
import toast from 'react-hot-toast';

// Query keys
export const educationKeys = {
  all: ['educations'] as const,
  lists: () => [...educationKeys.all, 'list'] as const,
  list: () => [...educationKeys.lists()] as const,
  details: () => [...educationKeys.all, 'detail'] as const,
  detail: (id: number) => [...educationKeys.details(), id] as const,
};

/**
 * Hook to fetch all education records for the current user
 */
export const useMyEducations = () => {
  return useQuery({
    queryKey: educationKeys.list(),
    queryFn: getMyEducations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific education record
 */
export const useMyEducation = (id: number) => {
  return useQuery({
    queryKey: educationKeys.detail(id),
    queryFn: () => getMyEducation(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new education record
 */
export const useCreateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEducationDto) => createMyEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() });
      toast.success('Education record created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create education record';
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to update an existing education record
 */
export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEducationDto }) => 
      updateMyEducation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() });
      queryClient.invalidateQueries({ queryKey: educationKeys.detail(variables.id) });
      toast.success('Education record updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update education record';
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to delete an education record
 */
export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMyEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.list() });
      toast.success('Education record deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete education record';
      toast.error(errorMessage);
    },
  });
};
