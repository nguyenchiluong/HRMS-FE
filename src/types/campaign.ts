export interface CampaignFormData {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  activityType: 'walking' | 'running' | 'cycling';
  targetGoal?: number;
  imageFile?: File;
}

export interface Campaign extends CampaignFormData {
  id: string;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
  imageUrl?: string;
  primaryMetric?: string;
  targetGoal?: number;
  participantCount?: number;
  totalDistance?: number;
}

export interface CampaignListItem extends Campaign {
  primaryMetric: string;
  participants: number;
  totalDistance: number;
  pendingSubmissions: number;
  image: string;
}

export interface ActivitySubmissionData {
  campaignId: string;
  activityDate: string; // Format: YYYY-MM-DD
  distance: number;
  imageFile: File;
}

export interface EmployeeActivity {
  activityId: string; // Hoặc number tùy cấu hình, nhưng string an toàn hơn cho BigInt
  activityDate: string; 
  metrics: string; 
  proofImage: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; 

  rejectionReason?: string;
}


export interface LeaderboardEntry {
  rank: number;
  employeeId: string;
  employeeName: string;
  department?: string;
  totalPoints: number; // Có thể là totalDistance tùy logic
  completedActivities: number;
  lastActivityDate: string;
}

export interface MyRankInfo {
  rank: number;
  totalPoints: number;
  completedActivities: number;
  pointsToNextRank: number; // Khoảng cách điểm để leo hạng
  nextRankName?: string; // Ví dụ: "Top 3", "Top 10"
}

