import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCampaign, getCampaigns} from '@/services/campaignService';
import type { CampaignFormData } from '@/types/campaign';

export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newCampaign: CampaignFormData) => createCampaign(newCampaign),
    onSuccess: () => {
      // Invalidate and refetch campaigns list
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

