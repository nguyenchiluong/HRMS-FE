import { createCampaign, getCampaigns, updateCampaign, publishCampaign, getActiveCampaigns, registerForCampaign, getMyCampaigns } from '@/api/campaign';
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

export const usePublishCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishCampaign(id),
    onSuccess: () => {
      // Sau khi publish thành công -> Refresh lại danh sách để thấy trạng thái mới (Active)
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      // Có thể thêm toast.success("Campaign published!") ở UI
    },
  });
};


// Hook to fetch active campaigns
export const useActiveCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: ['active-campaigns'],
    queryFn: getActiveCampaigns,
  });
};

// Hook: Lấy danh sách chiến dịch tôi đã tham gia
export const useMyCampaigns = () => {
  return useQuery<Campaign[]>({
    queryKey: ['my-campaigns'], // Key riêng để cache
    queryFn: getMyCampaigns,    // Gọi API lấy lịch sử
  });
};

// Hook to register for a campaign
export const useRegisterCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => registerForCampaign(campaignId),
    onSuccess: () => {
      // Invalidate queries to refresh the list (e.g., move from "Can Join" to "My Active")
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] });
      // If you have a query for "my-registered-campaigns", invalidate that too
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    },
  });
};

