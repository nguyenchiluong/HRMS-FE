import { createCampaign, getCampaigns, updateCampaign } from '@/api/campaign';
import type { Campaign, CampaignFormData } from '@/types/campaign';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => getCampaigns(),
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCampaign: CampaignFormData) => createCampaign(newCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

// SỬA LỖI - Đảm bảo đúng parameters
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Campaign>) =>
      updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};
