/**
 * Regulation Service - API calls và data transformation
 */

import api from '../api';
import type { RegulationResponse, RegulationUIData } from '../types/regulation';

/**
 * Transform regulation API response thành UI data theo locale
 */
export function transformRegulationForUI(
  regulation: RegulationResponse,
  locale: string
): RegulationUIData {
  // Lấy content theo locale, không fallback
  const content = regulation.content[locale];
  
  return {
    title: content?.title || '',
    shortDescription: content?.shortDescription || '',
    detailedContent: content?.detailedContent || '',
    vr360Link: regulation.vr360Link,
    vrTitle: regulation.vrTitle,
    isDisplaying: regulation.isDisplaying,
  };
}

/**
 * Lấy regulation data từ API
 */
export async function getRegulation(
  propertyId: number,
  tenantCode: string = 'fusion'
): Promise<RegulationResponse> {
  const response = await api.get<RegulationResponse>('/vr-hotel/rules', {
    headers: {
      'x-property-id': propertyId,
      'x-tenant-code': tenantCode,
    },
  });
  
  return response.data;
}

/**
 * Lấy regulation với UI data đã transform
 */
export function getRegulationForUI(
  propertyId: number,
  locale: string,
  tenantCode?: string
): Promise<RegulationUIData> {
  return getRegulation(propertyId, tenantCode).then(regulation => 
    transformRegulationForUI(regulation, locale)
  );
}

export const regulationService = {
  getRegulation,
  getRegulationForUI,
  transformRegulationForUI,
};
