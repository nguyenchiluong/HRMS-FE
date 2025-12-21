import {
  createInitialProfile,
  getDepartments,
  getPositions,
} from '@/api/employee';
import type {
  Department,
  InitialProfilePayload,
  Position,
} from '@/types/employee';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePositions = () => {
  return useQuery<Position[]>({
    queryKey: ['positions'],
    queryFn: getPositions,
  });
};

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};

export const useCreateInitialProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InitialProfilePayload) => createInitialProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
