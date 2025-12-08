import type { Campaign, CampaignFormData } from '@/types/campaign';
import api from './base';

// Relative path since baseURL is already defined in base.ts
const CAMPAIGN_ENDPOINT = '/api/campaigns';

// ============================================================================
// Data Transformations
// ============================================================================

// Frontend -> Backend (Create)
const transformFrontendToBackend = (data: CampaignFormData) => ({
  campaignName: data.name,
  description: data.description,
  campaignType: data.activityType,
  startDate: data.startDate,
  endDate: data.endDate,
  status: 'draft', // Default status
  // startTime/endTime removed per backend changes
});

// Backend -> Frontend (Read)
const transformBackendToFrontend = (data: any): Campaign => ({
  id: String(data.campaignId),
  name: data.campaignName,
  description: data.description,
  startDate: data.startDate,
  endDate: data.endDate,
  startTime: data.startTime ? data.startTime.substring(0, 5) : '00:00',
  endTime: data.endTime ? data.endTime.substring(0, 5) : '23:59',
  activityType: (data.campaignType || 'walking').toLowerCase(),
  status: (data.status || 'draft').toLowerCase(),
  createdAt: data.createdAt,
  imageUrl: data.imageUrl,
  primaryMetric: data.primaryMetric,
});

// ============================================================================
// API Functions
// ============================================================================

export const getCampaigns = async (search?: string): Promise<Campaign[]> => {
  try {
    // Determine URL based on search presence
    const url = search ? `${CAMPAIGN_ENDPOINT}/search` : CAMPAIGN_ENDPOINT;

    // Axios handles param encoding automatically
    const params = search ? { q: search } : {};

    const response = await api.get(url, { params });

    if (Array.isArray(response.data)) {
      return response.data.map(transformBackendToFrontend);
    }

    return [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return []; // Return empty array on error so UI doesn't crash
  }
};

export const createCampaign = async (
  data: CampaignFormData,
): Promise<Campaign> => {
  try {
    const payload = transformFrontendToBackend(data);

    const response = await api.post(CAMPAIGN_ENDPOINT, payload);

    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error; // Re-throw so the form component can show an error message
  }
};

export const updateCampaign = async (
  id: string,
  data: Partial<Campaign>,
): Promise<Campaign> => {
  try {
    // Construct payload mapping for update
    const payload = {
      campaignName: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      // Add other fields here if your backend supports updating them
    };

    const response = await api.put(`${CAMPAIGN_ENDPOINT}/${id}`, payload);

    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
};
