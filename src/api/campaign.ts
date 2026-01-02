import type { Campaign, CampaignFormData } from '@/types/campaign';
import { uploadFileToS3 } from './storage';
import springApi from './spring';

// Relative path since baseURL is already defined in base.ts
const CAMPAIGN_ENDPOINT = '/api/campaigns'; 

// ============================================================================
// Helpers (Logic xử lý thời gian & Ảnh)
// ============================================================================

// Helper: Format giờ cho chuẩn Backend (HH:mm -> HH:mm:ss)
const formatTime = (time?: string) => {
  if (!time) return undefined;
  return time.length === 5 ? `${time}:00` : time;
};

// Helper: Upload ảnh lên S3 (sử dụng shared utility)
// This is kept for backward compatibility, but now uses the shared uploadFileToS3 function
export const uploadImageToS3 = async (file: File): Promise<string> => {
  return await uploadFileToS3(file);
};

// ============================================================================
// Data Transformations
// ============================================================================

// Frontend -> Backend (Create & Update mapping logic)
// Chúng ta viết lại hàm này để dùng chung cho cả Create và Update để tránh sai sót
const createPayload = (data: Partial<Campaign> | CampaignFormData, imageUrl?: string) => {
  return {
    // Map đúng tên trường Backend yêu cầu
    campaignName: data.name, 
    description: data.description,
    campaignType: data.activityType, // Quan trọng: Leader thiếu cái này
    
    startDate: data.startDate,
    endDate: data.endDate,
    
    // Khôi phục lại logic thời gian mà Leader đã bỏ lỡ
    startTime: formatTime(data.startTime),
    endTime: formatTime(data.endTime),
    
    // Logic ảnh
    imageUrl: imageUrl || data.imageFile, 
    
    status: 'draft', // Backend sẽ tự xử lý, nhưng gửi kèm cũng không sao
  };
};

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
    const url = search ? `${CAMPAIGN_ENDPOINT}/search` : CAMPAIGN_ENDPOINT;
    const params = search ? { q: search } : {};

    const response = await springApi.get(url, { params });

    if (Array.isArray(response.data)) {
      return response.data.map(transformBackendToFrontend);
    }

    return [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};

export const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
  try {
    let finalImageUrl = "";

    // 1. Upload ảnh nếu có
    if (data.imageFile) {
      finalImageUrl = await uploadImageToS3(data.imageFile);
    }

    // 2. Tạo payload chuẩn
    const payload = createPayload(data, finalImageUrl);

    // 3. Gọi API
    const response = await springApi.post(CAMPAIGN_ENDPOINT, payload);

    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

export const updateCampaign = async (
  id: string, 
  data: Partial<Campaign>, 
  newImageFile?: File //Tham số update ảnh mới
): Promise<Campaign> => {
  try {
    let finalImageUrl = data.imageUrl; // Mặc định dùng link ảnh hiện tại (hoặc rỗng nếu user xóa)

    // 1. Nếu có file ảnh mới -> Upload lên S3 lấy link mới
    if (newImageFile) {
      console.log("Uploading new image for update...");
      finalImageUrl = await uploadImageToS3(newImageFile);
    }

    // 2. Tạo payload (Dùng lại hàm createPayload để đảm bảo mapping chuẩn)
    const payload = createPayload(data, finalImageUrl);

    console.log("Updating campaign with payload:", payload);

    const response = await springApi.put(`${CAMPAIGN_ENDPOINT}/${id}`, payload);

    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
};