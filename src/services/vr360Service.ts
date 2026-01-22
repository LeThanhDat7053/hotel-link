/**
 * VR360 Service - Kết nối với FastAPI backend để lấy VR360 links
 * 
 * Service này cung cấp các methods để:
 * - Lấy danh sách VR360 links (có filter theo category, room, facility)
 * - Lấy chi tiết một VR360 link
 * - Tạo, cập nhật, xóa VR360 links (admin)
 * 
 * Tất cả requests đều sử dụng api instance từ api.ts
 * với Bearer token authentication tự động
 */

import api from '../../api';
import { API_ENDPOINTS } from '../constants/config';
import type {
  VR360Link,
  VR360ListParams,
  CreateVR360LinkDTO,
  UpdateVR360LinkDTO,
  VR360CategoryType,
  VrHotelSettingsResponse,
} from '../types/api';

// ===== RESPONSE TYPES =====
interface VR360ListResponse {
  data: VR360Link[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface VR360DetailResponse {
  data: VR360Link;
}

interface VR360CreateResponse {
  data: VR360Link;
  message: string;
}

interface VR360UpdateResponse {
  data: VR360Link;
  message: string;
}

interface VR360DeleteResponse {
  message: string;
  id: string;
}

// ===== VR HOTEL SETTINGS =====
interface VrHotelSettingsParams {
  propertyId: number;
}

/**
 * Lấy VR Hotel Settings cho property
 * @param params - Property ID
 * @returns VrHotelSettingsResponse
 */
const getVrHotelSettings = async (params: VrHotelSettingsParams): Promise<VrHotelSettingsResponse> => {
  const response = await api.get('/vr-hotel/settings', {
    headers: {
      'x-property-id': params.propertyId.toString(),
    },
  });
  return response.data;
};

// ===== ERROR HANDLING =====
interface APIError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>; // For validation errors (422)
}

const handleAPIError = (error: any): never => {
  if (error.response) {
    const apiError = error.response.data as APIError;
    
    // FastAPI validation errors (422)
    if (error.response.status === 422 && apiError.errors) {
      const errorMessages = Object.entries(apiError.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      throw new Error(`Validation Error: ${errorMessages}`);
    }
    
    // Other API errors
    throw new Error(apiError.detail || apiError.message || 'API request failed');
  }
  
  throw error;
};

// ===== SERVICE METHODS =====

/**
 * Lấy danh sách VR360 links với filter options
 * 
 * @example
 * // Lấy tất cả VR360 links
 * const allLinks = await vr360Service.getVR360Links();
 * 
 * // Lấy VR360 links của category ROOM
 * const roomLinks = await vr360Service.getVR360Links({ category: VR360Category.ROOM });
 * 
 * // Lấy VR360 links của một room cụ thể
 * const roomVRLinks = await vr360Service.getVR360Links({ roomId: 'room-123' });
 */
export const getVR360Links = async (
  params?: VR360ListParams
): Promise<VR360ListResponse> => {
  try {
    const response = await api.get<VR360ListResponse>(API_ENDPOINTS.VR360, {
      params: {
        category: params?.category,
        room_id: params?.roomId,
        facility_id: params?.facilityId,
        is_active: params?.isActive,
        page: params?.page || 1,
        limit: params?.limit || 20,
      },
    });
    
    return response.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Lấy VR360 links theo category
 * 
 * @example
 * const lobbyLinks = await vr360Service.getVR360ByCategory('LOBBY');
 */
export const getVR360ByCategory = async (
  category: VR360CategoryType
): Promise<VR360Link[]> => {
  try {
    const response = await api.get<{ data: VR360Link[] }>(
      `${API_ENDPOINTS.VR360_BY_CATEGORY}/${category}`
    );
    
    return response.data.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Lấy VR360 links của một room cụ thể
 * 
 * @example
 * const roomVRLinks = await vr360Service.getVR360ByRoom('room-123');
 */
export const getVR360ByRoom = async (roomId: string): Promise<VR360Link[]> => {
  try {
    const response = await api.get<{ data: VR360Link[] }>(
      `${API_ENDPOINTS.VR360_BY_ROOM}/${roomId}`
    );
    
    return response.data.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Lấy VR360 links của một facility cụ thể
 * 
 * @example
 * const poolVRLinks = await vr360Service.getVR360ByFacility('pool-1');
 */
export const getVR360ByFacility = async (
  facilityId: string
): Promise<VR360Link[]> => {
  try {
    const response = await api.get<{ data: VR360Link[] }>(
      `${API_ENDPOINTS.VR360_BY_FACILITY}/${facilityId}`
    );
    
    return response.data.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Lấy chi tiết một VR360 link
 * 
 * @example
 * const vrLink = await vr360Service.getVR360Detail('vr-123');
 */
export const getVR360Detail = async (id: string): Promise<VR360Link> => {
  try {
    const response = await api.get<VR360DetailResponse>(
      `${API_ENDPOINTS.VR360}/${id}`
    );
    
    return response.data.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Tạo VR360 link mới (Admin only)
 * 
 * @example
 * const newVRLink = await vr360Service.createVR360Link({
 *   title: 'Deluxe Room VR Tour',
 *   vrUrl: 'https://vr360.example.com/deluxe-room',
 *   category: VR360Category.ROOM,
 *   roomId: 'room-123'
 * });
 */
export const createVR360Link = async (
  data: CreateVR360LinkDTO
): Promise<VR360Link> => {
  try {
    const response = await api.post<VR360CreateResponse>(
      API_ENDPOINTS.VR360,
      data
    );
    
    return response.data.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Cập nhật VR360 link (Admin only)
 * 
 * @example
 * const updated = await vr360Service.updateVR360Link('vr-123', {
 *   title: 'Updated Title',
 *   isActive: false
 * });
 */
export const updateVR360Link = async (
  id: string,
  data: UpdateVR360LinkDTO
): Promise<VR360Link> => {
  try {
    const response = await api.patch<VR360UpdateResponse>(
      `${API_ENDPOINTS.VR360}/${id}`,
      data
    );
    
    return response.data.data;
  } catch (error) {
    return handleAPIError(error);
  }
};

/**
 * Xóa VR360 link (Admin only)
 * 
 * @example
 * await vr360Service.deleteVR360Link('vr-123');
 */
export const deleteVR360Link = async (id: string): Promise<void> => {
  try {
    await api.delete<VR360DeleteResponse>(`${API_ENDPOINTS.VR360}/${id}`);
  } catch (error) {
    handleAPIError(error);
  }
};

// Export default object
const vr360Service = {
  getVR360Links,
  getVR360ByCategory,
  getVR360ByRoom,
  getVR360ByFacility,
  getVR360Detail,
  createVR360Link,
  updateVR360Link,
  deleteVR360Link,
  getVrHotelSettings,
};

export default vr360Service;
