import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { reassignSupervisors, type ReassignSupervisorsPayload } from '../api';
import { employeeKeys } from './useEmployees';
import { employeeStatsKeys } from './useEmployeeStats';

interface UseReassignSupervisorsOptions {
  onSuccess?: () => void;
}

export const useReassignSupervisors = (
  options?: UseReassignSupervisorsOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      data,
    }: {
      employeeId: number;
      data: ReassignSupervisorsPayload;
    }) => reassignSupervisors(employeeId, data),
    onSuccess: () => {
      // Invalidate both employees list and stats
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeStatsKeys.all });
      toast.success('Supervisors updated successfully!');
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update supervisors');
      }
    },
  });
};

