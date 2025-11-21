import type { Campaign, CampaignFormData } from "@/types/campaign";

// Mock API functions
export const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
  // Simulate API call
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
      resolve([]);
    }, 500);
  });
};