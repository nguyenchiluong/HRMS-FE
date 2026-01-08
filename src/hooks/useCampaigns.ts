import { createCampaign, getCampaigns, updateCampaign, publishCampaign, 
getActiveCampaigns, registerForCampaign, getMyCampaigns, submitActivity, 
getMyCampaignActivities, getCampaignById, deleteActivityApi, updateActivityApi, 
getCampaignLeaderboard, getMyCampaignRank, leaveCampaignApi, closeCampaignApi} from '@/api/campaign';
import type { Campaign, CampaignFormData, ActivitySubmissionData } from '@/types/campaign';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

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
      toast.success("Campaign created successfully!"); 
    },
    onError: (error: any) => {
      toast.error(error?.response?.data || "Failed to create campaign");
    }
  });
};

// src/hooks/useCampaigns.ts

// src/hooks/useCampaigns.ts

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data, imageFile }: { id: string; data: Partial<Campaign>; imageFile?: File }) => {
      return updateCampaign(id, data, imageFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campaign updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data || "Failed to update campaign");
    }
  });
};

export const usePublishCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Campaign published successfully!");
    },
    onError: () => {
      toast.error("Failed to publish campaign");
    }
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
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      toast.success("Registered successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data || "Failed to register");
    }
  });
};

// Hook: Submit Activity
export const useSubmitActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivitySubmissionData) => submitActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      toast.success("Activity submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit activity");
    }
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
      queryClient.invalidateQueries({ queryKey: ['campaign-activities'] });
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      toast.success("Activity deleted.");
    },
    onError: () => toast.error("Failed to delete activity"),
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
      toast.success("Activity updated.");
    },
    onError: () => toast.error("Failed to update activity"),
  });
};

// Hook: Lấy Leaderboard chung
export const useCampaignLeaderboard = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaign-leaderboard', campaignId],
    queryFn: () => getCampaignLeaderboard(campaignId),
    enabled: !!campaignId,
    staleTime: 1000 * 60, // Cache 1 phút vì leaderboard thay đổi liên tục
  });
};

// Hook: Lấy Rank của tôi (Chỉ chạy khi không phải chế độ Admin)
export const useMyRank = (campaignId: string, isEmployeeView: boolean = true) => {
  return useQuery({
    queryKey: ['my-rank', campaignId],
    queryFn: () => getMyCampaignRank(campaignId),
    enabled: !!campaignId && isEmployeeView, 
  });
};

// Hook: Rời chiến dịch
export const useLeaveCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => leaveCampaignApi(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-leaderboard'] });
      toast.success("You have left the campaign.");
    },
    onError: (err: any) => toast.error(err?.response?.data || "Failed to leave campaign"),
  });
};



// Hook: Close Campaign (Admin)
export const useCloseCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => closeCampaignApi(id),
    onSuccess: () => {
      // Refresh tất cả các list liên quan
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });        // Admin list
      queryClient.invalidateQueries({ queryKey: ['active-campaigns'] }); // Employee Active
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });     // Employee My/Past
      
      // Hiện thông báo
      toast.success("Campaign closed successfully. Final results published.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data || "Failed to close campaign.");
    }
  });
};