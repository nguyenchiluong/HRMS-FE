import type { Campaign, CampaignFormData } from "@/types/campaign";

const API_BASE_URL = 'http://localhost:8080/api/campaigns';

// Helper: Chuyển đổi dữ liệu từ Backend -> Frontend
const transformCampaignData = (data: any): Campaign => ({
  id: data.id,
  name: data.name,
  description: data.description,
  startDate: data.startDate,
  // Cắt bỏ giây: "09:00:00" -> "09:00"
  startTime: data.startTime ? data.startTime.substring(0, 5) : '',
  endDate: data.endDate,
  endTime: data.endTime ? data.endTime.substring(0, 5) : '',
  // Chuyển Enum về chữ thường: "RUNNING" -> "running"
  activityType: data.activityType ? data.activityType.toLowerCase() : 'walking',
  status: data.status ? data.status.toLowerCase() : 'draft',
  createdAt: data.createdAt,
  imageUrl: data.imageUrl
});

// 1. Tích hợp API lấy danh sách (View List)
export const getCampaigns = async (search?: string): Promise<Campaign[]> => {
  try {
    // Xây dựng URL (có search nếu cần)
    const url = search 
      ? `${API_BASE_URL}?search=${encodeURIComponent(search)}` 
      : API_BASE_URL;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Kiểm tra cấu trúc ApiResponse từ Backend { success: true, data: [...] }
    if (result.success && Array.isArray(result.data)) {
      return result.data.map(transformCampaignData);
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    // Trả về mảng rỗng để không crash UI nếu lỗi mạng
    return [];
  }
};


export const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock create:", data);
      resolve({
         ...data,
         id: 'mock-id',
         createdAt: new Date().toISOString(),
         status: 'draft'
      } as Campaign);
    }, 1000);
  });
};

export const updateCampaign = async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock update:", id, data);
      resolve({ ...data, id } as Campaign);
    }, 1000);
  });
};