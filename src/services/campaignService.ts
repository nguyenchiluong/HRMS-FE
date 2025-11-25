import type { Campaign, CampaignFormData } from "@/types/campaign";

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: "Company Running Challenge 2025",
    description: "Join our annual running challenge and compete with colleagues",
    startDate: "2025-01-15",
    startTime: "09:00",
    endDate: "2025-03-15", 
    endTime: "17:00",
    activityType: "running",
    status: "active",
    createdAt: "2024-12-01T10:00:00Z"
  },
  {
    id: '2',
    name: "Fitness Month - March",
    description: "Complete fitness activities and earn points",
    startDate: "2025-03-01",
    startTime: "09:00",
    endDate: "2025-03-31",
    endTime: "17:00",
    activityType: "walking",
    status: "draft",
    createdAt: "2024-12-15T14:30:00Z"
  },
  {
    id: '3',
    name: "Q4 2024 Marathon",
    description: "Long-distance running competition",
    startDate: "2024-10-01",
    startTime: "09:00",
    endDate: "2024-12-31",
    endTime: "17:00",
    activityType: "running",
    status: "completed",
    createdAt: "2024-09-01T08:00:00Z"
  },
];

// Mock API functions
export const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaign: Campaign = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        status: 'draft'
      };
      resolve(campaign);
    }, 1000);
  });
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCampaigns);
    }, 500);
  });
};

// THÊM HÀM NÀY VÀO ĐỂ CẬP NHẬT CHIẾN DỊCH
export const updateCampaign = async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
      if (campaignIndex === -1) {
        reject(new Error('Campaign not found'));
        return;
      }
      
      const updatedCampaign = { 
        ...mockCampaigns[campaignIndex], 
        ...data,
        id: mockCampaigns[campaignIndex].id // Giữ nguyên ID
      };
      
      // Update trong mock data
      mockCampaigns[campaignIndex] = updatedCampaign;
      resolve(updatedCampaign);
    }, 500);
  });
};