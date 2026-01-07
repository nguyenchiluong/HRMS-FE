import { useQuery } from '@tanstack/react-query';
import { getManagers } from '../api';
import type { ManagerOrHrDto } from '../api';

export const managerKeys = {
  all: ['managers'] as const,
  lists: () => [...managerKeys.all, 'list'] as const,
  list: (search?: string) => [...managerKeys.lists(), search] as const,
};

interface UseManagersParams {
  search?: string;
  enabled?: boolean;
}

export const useManagers = ({ search, enabled = true }: UseManagersParams = {}) => {
  return useQuery<ManagerOrHrDto[]>({
    queryKey: managerKeys.list(search),
    queryFn: () => getManagers(search),
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
};

