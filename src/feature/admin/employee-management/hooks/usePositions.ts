import type { Position } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';
import { getPositions } from '../api';

export const usePositions = () => {
  return useQuery<Position[]>({
    queryKey: ['positions'],
    queryFn: getPositions,
  });
};

