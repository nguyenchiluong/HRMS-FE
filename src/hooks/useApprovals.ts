import { 
  getPendingCampaigns, 
  getPendingActivities, 
  approveActivity, 
  rejectActivity 
} from '@/api/approval';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

// Hook: Lấy danh sách campaign có bài pending (Dashboard)
export const usePendingCampaigns = () => {
  return useQuery({
    queryKey: ['pending-campaigns'],
    queryFn: getPendingCampaigns,
  });
};

// Hook: Lấy chi tiết bài pending của 1 campaign
export const usePendingActivities = (campaignId: string) => {
  return useQuery({
    queryKey: ['pending-activities', campaignId],
    queryFn: () => getPendingActivities(campaignId),
    enabled: !!campaignId, // Chỉ fetch khi có ID
  });
};

// Hook: Approve Activity
export const useApproveActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: number) => approveActivity(activityId),
    onSuccess: (_, activityId) => {
      // Refresh lại danh sách activities
      queryClient.invalidateQueries({ queryKey: ['pending-activities'] });
      // Refresh lại dashboard (số lượng pending thay đổi)
      queryClient.invalidateQueries({ queryKey: ['pending-campaigns'] });

      toast.success("Submission approved successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data || "Failed to approve activity");
    }
  });
};

// Hook: Reject Activity
export const useRejectActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectActivity(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-activities'] });
      queryClient.invalidateQueries({ queryKey: ['pending-campaigns'] });

      toast.success("Submission rejected.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data || "Failed to reject activity");
    }
  });
};