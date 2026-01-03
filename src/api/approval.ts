import springApi from './spring';
import type { PendingCampaign, PendingSubmission, RejectRequest } from '@/types/manager';

const APPROVAL_ENDPOINT = '/api/admin/approvals';

// 1. Dashboard: Lấy danh sách Campaign cần duyệt
export const getPendingCampaigns = async (): Promise<PendingCampaign[]> => {
  const { data } = await springApi.get(`${APPROVAL_ENDPOINT}/campaigns`);
  return data;
};

// 2. Review Page: Lấy chi tiết bài pending
export const getPendingActivities = async (campaignId: string): Promise<PendingSubmission[]> => {
  const { data } = await springApi.get(`${APPROVAL_ENDPOINT}/campaigns/${campaignId}/activities`);
  return data;
};

// 3. Approve
export const approveActivity = async (activityId: number): Promise<string> => {
  const { data } = await springApi.post(`${APPROVAL_ENDPOINT}/${activityId}/approve`);
  return data;
};

// 4. Reject
export const rejectActivity = async (activityId: number, reason: string): Promise<string> => {
  const payload: RejectRequest = { reason };
  const { data } = await springApi.post(`${APPROVAL_ENDPOINT}/${activityId}/reject`, payload);
  return data;
};