/**
 * Contact Service - API calls và data transformation
 */

import api from '../api';
import type { ContactResponse, ContactUIData } from '../types/contact';

/**
 * Transform contact API response thành UI data theo locale
 */
export function transformContactForUI(
  contact: ContactResponse,
  locale: string
): ContactUIData {
  // Lấy data theo locale, không fallback
  const address = contact.address[locale] || '';
  const workingHours = contact.workingHours[locale] || '';
  const contentByLocale = contact.content[locale];
  
  return {
    phone: contact.phone || '',
    email: contact.email || '',
    website: contact.website || '',
    address,
    socialMedia: contact.socialMedia || {},
    mapCoordinates: contact.mapCoordinates || '',
    workingHours,
    description: contentByLocale?.description || '',
    vr360Link: contact.vr360Link,
    vrTitle: contact.vrTitle,
    isDisplaying: contact.isDisplaying,
  };
}

/**
 * Lấy contact data từ API
 */
export async function getContact(
  propertyId: number
): Promise<ContactResponse> {
  const response = await api.get<ContactResponse>('/vr-hotel/contact', {
    headers: {
      'x-property-id': propertyId,
    },
  });
  
  return response.data;
}

/**
 * Lấy contact với UI data đã transform
 */
export function getContactForUI(
  propertyId: number,
  locale: string
): Promise<ContactUIData> {
  return getContact(propertyId).then(contact => 
    transformContactForUI(contact, locale)
  );
}

export const contactService = {
  getContact,
  getContactForUI,
  transformContactForUI,
};
