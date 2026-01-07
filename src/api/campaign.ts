import type { Campaign, CampaignFormData, ActivitySubmissionData, LeaderboardEntry, MyRankInfo} from '@/types/campaign';
import springApi from './spring';
import type { EmployeeActivity } from '@/types/campaign';

// Relative path since baseURL is already defined in base.ts
const CAMPAIGN_ENDPOINT = '/api/campaigns';
const STORAGE_ENDPOINT = '/storage'; // Thêm endpoint storage
// Hardcode CloudFront URL dựa trên thông tin bạn cung cấp trước đó
const CLOUDFRONT_URL = 'https://d30yuvccb40k7f.cloudfront.net'; 

// ============================================================================
// Helpers (Logic xử lý thời gian & Ảnh)
// ============================================================================

// Helper: Format giờ cho chuẩn Backend (HH:mm -> HH:mm:ss)
const formatTime = (time?: string) => {
  if (!time) return undefined;
  return time.length === 5 ? `${time}:00` : time;
};

// Helper: Upload ảnh lên S3 
export const uploadImageToS3 = async (file: File): Promise<string> => {
  try {
    
    // 1. Xin Presigned URL
    const response = await springApi.get(`${STORAGE_ENDPOINT}/presigned-url`, {
      params: { 
        // extension: extension
        fileName: file.name,
        contentType: file.type 
      }
    });
    
    const uploadUrl = response.data.url; // Axios trả về data trực tiếp

    // 2. Upload file lên S3
    // LƯU Ý: Dùng fetch thuần ở đây để tránh Interceptor của Axios can thiệp vào header
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    });

    if (!uploadRes.ok) throw new Error('Failed to upload image to S3');

    // 3. Ghép link CloudFront
    const urlObj = new URL(uploadUrl);
    const fileKey = urlObj.pathname;
    return `${CLOUDFRONT_URL}${fileKey}`;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
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

  participantCount: data.participantCount || 0,
  totalDistance: data.totalDistance || 0,
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

// Lấy chi tiết Campaign theo ID
export const getCampaignById = async (id: string): Promise<Campaign> => {
  try {
    const response = await springApi.get(`${CAMPAIGN_ENDPOINT}/${id}`);
    // Reuse hàm transform để map dữ liệu cho khớp frontend
    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error(`Error fetching campaign details for id ${id}:`, error);
    throw error;
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

export const publishCampaign = async (id: string): Promise<Campaign> => {
  try {
    // Gọi API POST /campaigns/{id}/publish
    const response = await springApi.post(`${CAMPAIGN_ENDPOINT}/${id}/publish`);
    
    // API trả về Campaign đã được update status -> map lại cho Frontend dùng
    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error('Error publishing campaign:', error);
    throw error;
  }
};

// --- NEW FUNCTIONS FOR EMPLOYEE ---

// Fetch ONLY active campaigns for employees to join
export const getActiveCampaigns = async (): Promise<Campaign[]> => {
  try {
    // Assuming Backend has an endpoint like /api/campaigns/active
    // If not, you might need to use getCampaigns() and filter by status 'active' on frontend
    // But better to have a dedicated endpoint for performance.
    const response = await springApi.get(`${CAMPAIGN_ENDPOINT}/active`);
    
    if (Array.isArray(response.data)) {
      return response.data.map(transformBackendToFrontend);
    }
    return [];
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
    return [];
  }
};

// Register for a campaign
export const registerForCampaign = async (campaignId: string): Promise<string> => {
  try {
    // Endpoint: POST /api/campaigns/{id}/register
    const response = await springApi.post(`${CAMPAIGN_ENDPOINT}/${campaignId}/register`);
    return response.data; // Usually returns a success message string
  } catch (error) {
    console.error('Error registering for campaign:', error);
    throw error;
  }
};

export const getMyCampaigns = async (): Promise<Campaign[]> => {
  // Gọi endpoint
  const { data } = await springApi.get('api/campaigns/my-campaigns');
  
  // 👇 QUAN TRỌNG: Map dữ liệu thô sang chuẩn Frontend (Campaign type)
  // Để đồng nhất id, name, activityType với các hàm khác
  if (Array.isArray(data)) {
    return data.map(transformBackendToFrontend);
  }
  return [];
};

// API: Submit Activity
export const submitActivity = async (data: ActivitySubmissionData): Promise<any> => {
  try {
    // 1. Upload ảnh lên S3
    const imageUrl = await uploadImageToS3(data.imageFile);

    // 2. Chuẩn bị payload
    const payload = {
      activityDate: data.activityDate,
      proofImage: imageUrl,
      metrics: JSON.stringify({
        distance: data.distance
      }),
      status: "pending"
    };

    // Gọi endpoint
    const response = await springApi.post(`${CAMPAIGN_ENDPOINT}/${data.campaignId}/activities`, payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting activity:', error);
    throw error;
  }
};

// API: Lấy danh sách hoạt động của chính mình trong một chiến dịch
export const getMyCampaignActivities = async (campaignId: string): Promise<EmployeeActivity[]> => {
  const response = await springApi.get(`${CAMPAIGN_ENDPOINT}/${campaignId}/activities/me`);
  return response.data;
};


// DELETE Activity Submission
export const deleteActivityApi = async (activityId: string | number): Promise<void> => {
  await springApi.delete(`${CAMPAIGN_ENDPOINT}/activities/${activityId}`);
};

// UPDATE Activity Submission
export const updateActivityApi = async (activityId: string | number, data: ActivitySubmissionData): Promise<any> => {
  try {
    let imageUrl = "";
    
    // Nếu có file ảnh mới thì upload, nếu không thì thôi
    if (data.imageFile) {
        imageUrl = await uploadImageToS3(data.imageFile);
    } 
    // Backend logic: nếu proofImage gửi lên là rỗng/null thì giữ nguyên ảnh cũ.
    // Frontend logic: ActivitySubmissionData yêu cầu imageFile, nhưng ở đây ta xử lý linh hoạt.

    const payload = {
      activityDate: data.activityDate,
      proofImage: imageUrl, // Gửi link mới (hoặc rỗng nếu không update ảnh)
      metrics: JSON.stringify({
        distance: data.distance
      })
      // Status backend tự giữ nguyên pending
    };

    const response = await springApi.put(`${CAMPAIGN_ENDPOINT}/activities/${activityId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};


// --- LEADERBOARD APIs ---

// Lấy danh sách Top xếp hạng (VD: Top 50)
export const getCampaignLeaderboard = async (campaignId: string): Promise<LeaderboardEntry[]> => {
  try {
    const response = await springApi.get(`${CAMPAIGN_ENDPOINT}/${campaignId}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return []; // Trả về mảng rỗng để không crash UI
  }
};

// Lấy hạng của chính mình (Chỉ dùng cho Employee)
export const getMyCampaignRank = async (campaignId: string): Promise<MyRankInfo> => {
  try {
    const response = await springApi.get(`${CAMPAIGN_ENDPOINT}/${campaignId}/leaderboard/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my rank:', error);
    throw error;
  }
};


// API: Rời chiến dịch
export const leaveCampaignApi = async (campaignId: string): Promise<void> => {
  try {
    // Endpoint phải khớp với Backend: /api/campaigns/{id}/leave
    await springApi.delete(`${CAMPAIGN_ENDPOINT}/${campaignId}/leave`);
  } catch (error) {
    console.error('Error leaving campaign:', error);
    throw error; // Ném lỗi để Hook xử lý hiển thị Toast
  }
};


// API: Đóng chiến dịch (Admin)
export const closeCampaignApi = async (id: string): Promise<Campaign> => {
  try {
    const response = await springApi.post(`${CAMPAIGN_ENDPOINT}/${id}/close`);
    return transformBackendToFrontend(response.data);
  } catch (error) {
    console.error('Error closing campaign:', error);
    throw error;
  }
};