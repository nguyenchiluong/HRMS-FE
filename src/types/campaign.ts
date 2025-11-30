export interface CampaignFormData {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  activityType: 'walking' | 'running' | 'cycling';
  imageFile?: File;
}

export interface Campaign extends CampaignFormData {
  id: string;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
  imageUrl?: string;
  primaryMetric?: string;
}

export interface CampaignListItem extends Campaign {
  primaryMetric: string;
  participants: number;
  totalDistance: number;
  pendingSubmissions: number;
  image: string;
}