export interface CampaignFormData {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  activityType: 'walking' | 'running' | 'cycling';
}

export interface Campaign extends CampaignFormData {
  id: string;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
}