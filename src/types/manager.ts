export interface PendingSubmission {
  id: number; // Backend trả về Long -> number
  employeeName: string;
  employeeEmail: string;
  submittedDate: string; // ISO LocalDateTime
  activityDate: string;  // ISO LocalDate
  metrics: string;       // JSON String: "{\"distance\": 5.5}"
  proofImage: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PendingCampaign {
  id: number; // Backend trả về Long -> number
  name: string;
  pendingCount: number;
}

export interface RejectRequest {
  reason: string;
}