/**
 * Policy Service - API calls và data transformation
 */

import api from '../api';
import type { PolicyResponse, PolicyUIData } from '../types/policy';

/**
 * Transform policy API response thành UI data theo locale
 */
export function transformPolicyForUI(
  policy: PolicyResponse,
  locale: string
): PolicyUIData {
  // Lấy content theo locale, không fallback
  const content = policy.content[locale];
  
  return {
    title: content?.title || '',
    shortDescription: content?.shortDescription || '',
    detailedContent: content?.detailedContent || '',
    vr360Link: policy.vr360Link,
    vrTitle: policy.vrTitle,
    isDisplaying: policy.isDisplaying,
  };
}

/**
 * Lấy policy data từ API
 */
export async function getPolicy(
  propertyId: number,
  tenantCode: string = 'fusion'
): Promise<PolicyResponse> {
  const response = await api.get<PolicyResponse>('/vr-hotel/policies', {
    headers: {
      'x-property-id': propertyId,
      'x-tenant-code': tenantCode,
    },
  });
  
  return response.data;
}

/**
 * Lấy policy với UI data đã transform
 */
export function getPolicyForUI(
  propertyId: number,
  locale: string,
  tenantCode?: string
): Promise<PolicyUIData> {
  return getPolicy(propertyId, tenantCode).then(policy => 
    transformPolicyForUI(policy, locale)
  );
}

export const policyService = {
  getPolicy,
  getPolicyForUI,
  transformPolicyForUI,
};
