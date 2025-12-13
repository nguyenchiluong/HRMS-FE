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

// src/hooks/useCampaigns.ts

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // Định nghĩa lại kiểu dữ liệu đầu vào:
    // Gồm 3 phần: id, data (thông tin text), và imageFile (tùy chọn)
    mutationFn: ({ id, data, imageFile }: { id: string; data: Partial<Campaign>; imageFile?: File }) => {
      // Gọi API updateCampaign với đủ 3 tham số
      return updateCampaign(id, data, imageFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};