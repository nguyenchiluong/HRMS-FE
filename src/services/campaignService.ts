import type { Campaign, CampaignFormData } from "@/types/campaign";

const API_BASE_URL = 'http://localhost:8080/api/campaigns'; 

// Hàm chuyển đổi: Biến dữ liệu Backend (mới) thành format Frontend (cũ)
const transformBackendToFrontend = (data: any): Campaign => ({
  // 1. Backend trả về 'campaignId' (Long) -> Frontend dùng 'id' (String)
  id: String(data.campaignId), 
  
  // 2. Backend trả về 'campaignName' -> Frontend dùng 'name'
  name: data.campaignName,
  
  description: data.description,
  startDate: data.startDate,
  endDate: data.endDate,
  
  // 3. Backend đã BỎ startTime/endTime -> Frontend giả lập dữ liệu mặc định để UI không lỗi
  startTime: data.startTime ? data.startTime.substring(0, 5) : '00:00', 
  endTime: data.endTime ? data.endTime.substring(0, 5) : '23:59',
  
  // 4. Backend trả về 'campaignType' -> Frontend dùng 'activityType'
  // Backend trả về string thường ('running'), Frontend cũng cần string thường -> OK
  activityType: (data.campaignType || 'walking').toLowerCase(),
  
  status: (data.status || 'draft').toLowerCase(),
  
  createdAt: data.createdAt,
  imageUrl: data.imageUrl,
  primaryMetric: data.primaryMetric
});

// Hàm chuyển đổi ngược: Frontend -> Backend (Dùng khi Tạo/Sửa)
const transformFrontendToBackend = (data: CampaignFormData) => ({
  campaignName: data.name,
  description: data.description,
  campaignType: data.activityType, // Gửi string thường
  startDate: data.startDate,
  endDate: data.endDate,
  // Tự động set status mặc định nếu cần
  status: 'draft', 
  // Không gửi startTime, endTime vì Backend không nhận nữa
});

export const getCampaigns = async (search?: string): Promise<Campaign[]> => {
  try {
    const url = search 
      ? `${API_BASE_URL}/search?q=${encodeURIComponent(search)}` // Backend mới dùng /search?q=...
      : API_BASE_URL;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    // Backend mới trả về trực tiếp mảng List<Campaign>, không bọc trong { success, data } nữa
    if (Array.isArray(data)) {
      return data.map(transformBackendToFrontend);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
};


export const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transformFrontendToBackend(data))
  });

  if (!response.ok) throw new Error('Failed to create campaign');
  const result = await response.json();
  return transformBackendToFrontend(result);
};

export const updateCampaign = async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
  // Logic mapping cho update tương tự...
  // Lưu ý: ID ở frontend là string, cần đảm bảo backend nhận đúng kiểu
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        campaignName: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        // ... map các trường khác nếu cần
    })
  });

  if (!response.ok) throw new Error('Failed to update campaign');
  const result = await response.json();
  return transformBackendToFrontend(result);
};