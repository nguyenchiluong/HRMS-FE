import type { TimeType } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';
import { getTimeTypes } from '../api';

export const useTimeTypes = () => {
  return useQuery<TimeType[]>({
    queryKey: ['timeTypes'],
    queryFn: getTimeTypes,
  });
};

