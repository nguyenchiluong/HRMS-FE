/**
 * React Query hooks for ID Change Requests
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  cancelIdChangeRequest,
  createIdChangeRequest,
  getIdChangeRequests,
  getRequestTypes,
  type CreateIdChangeRequestPayload,
  type GetIdChangeRequestsParams,
  type IdChangeRequestDto,
} from '../api/idChangeRequests';

// Query keys
export const idChangeRequestKeys = {
  all: ['idChangeRequests'] as const,
  lists: () => [...idChangeRequestKeys.all, 'list'] as const,
  list: (params?: GetIdChangeRequestsParams) =>
    [...idChangeRequestKeys.lists(), params] as const,
  details: () => [...idChangeRequestKeys.all, 'detail'] as const,
  detail: (id: string) => [...idChangeRequestKeys.details(), id] as const,
};

/**
 * Hook to get employee's ID change requests
 */
export const useIdChangeRequests = (params?: GetIdChangeRequestsParams) => {
  return useQuery({
    queryKey: idChangeRequestKeys.list(params),
    queryFn: () => getIdChangeRequests(params),
  });
};

/**
 * Hook to create an ID change request
 */
export const useCreateIdChangeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIdChangeRequestPayload) =>
      createIdChangeRequest(data),
    onSuccess: () => {
      // Invalidate and refetch requests list
      queryClient.invalidateQueries({
        queryKey: idChangeRequestKeys.lists(),
      });
      toast.success(
        'ID change request submitted successfully! Your request is now being reviewed by administrators.',
        { duration: 5000 },
      );
    },
    onError: (error) => {
      console.error('Failed to create ID change request:', error);
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Failed to submit ID change request. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to submit ID change request. Please try again.');
      }
    },
  });
};

/**
 * Hook to cancel an ID change request
 */
export const useCancelIdChangeRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, comment }: { requestId: string; comment?: string }) =>
      cancelIdChangeRequest(requestId, comment),
    onSuccess: () => {
      // Invalidate and refetch requests list
      queryClient.invalidateQueries({
        queryKey: idChangeRequestKeys.lists(),
      });
      toast.success('Request cancelled successfully');
    },
    onError: (error) => {
      console.error('Failed to cancel request:', error);
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'Failed to cancel request. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to cancel request. Please try again.');
      }
    },
  });
};

/**
 * Hook to get request types (to find PROFILE_ID_CHANGE request type ID)
 */
export const useRequestTypes = (
  category?: 'time-off' | 'timesheet' | 'profile' | 'other',
) => {
  return useQuery({
    queryKey: ['requestTypes', category],
    queryFn: async () => {
      const response = await getRequestTypes();
      let types = response.requestTypes.filter((type) => type.isActive);
      if (category) {
        types = types.filter((type) => type.category === category);
      }
      return types;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

