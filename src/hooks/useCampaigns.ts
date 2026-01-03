import { createCampaign, getCampaigns, updateCampaign, publishCampaign, 
getActiveCampaigns, registerForCampaign, getMyCampaigns, submitActivity, 
getMyCampaignActivities, getCampaignById, deleteActivityApi, updateActivityApi} from '@/api/campaign';
import type { Campaign, CampaignFormData, ActivitySubmissionData } from '@/types/campaign';
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

// Hook: Submit Activity
export const useSubmitActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivitySubmissionData) => submitActivity(data),
    onSuccess: () => {
      // Refresh lại dữ liệu campaign (nếu cần hiển thị progress ngay)
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    },
  });
};

// Hook: Lấy danh sách hoạt động của chính mình trong một chiến dịch
export const useMyCampaignActivities = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-activities', campaignId], // Key định danh cache
    queryFn: () => getMyCampaignActivities(campaignId), 
    enabled: !!campaignId, // Chỉ chạy khi có campaignId
  });
};

// Hook: Lấy chi tiết một chiến dịch theo ID
export const useCampaignDetail = (id: string) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => getCampaignById(id),
    enabled: !!id, // Chỉ chạy khi có id
  });
};

// Hook: Delete Activity
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string | number) => deleteActivityApi(activityId),
    onSuccess: () => {
      // Invalidate để refresh lại list
      queryClient.invalidateQueries({ queryKey: ['campaign-activities'] });
      // Refresh dashboard stats nếu cần
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    },
  });
};

// Hook: Update Activity
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: ActivitySubmissionData }) => 
      updateActivityApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-activities'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    },
  });
};