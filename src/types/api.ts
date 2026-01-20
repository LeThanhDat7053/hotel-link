/**
 * Auto-generated TypeScript types from OpenAPI Schema
 * Backend: https://travel.link360.vn/api/v1
 * Generated from: /api/v1/openapi.json
 * 
 * Usage:
 *   import type { PropertyResponse, FeatureResponse } from '@/types/api';
 */

// ============= AUTH =============
export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ============= USER =============
export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface AdminUserResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Current User Response (from /users/me endpoint)
 */
export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at: string | null;
}

// ============= PROPERTY POSTS =============
export interface PostTranslation {
  post_id: number;
  locale: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyPost {
  id: number;
  property_id: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string | null;
  translations: PostTranslation[];
}

// ============= PROPERTY =============
export interface PropertyResponse {
  id: number;
  tenant_id: number;
  property_name: string;
  code: string;
  slogan?: string;
  description?: string;
  logo_url?: string;
  banner_images?: string[];
  intro_video_url?: string;
  vr360_url?: string;
  address?: string;
  district?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  phone_number?: string;
  email?: string;
  website_url?: string;
  zalo_oa_id?: string;
  facebook_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  google_map_url?: string;
  latitude?: number;
  longitude?: number;
  primary_color?: string;
  secondary_color?: string;
  copyright_text?: string;
  terms_url?: string;
  privacy_url?: string;
  timezone?: string;
  default_locale: string;
  settings_json?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// ============= FEATURE CATEGORY =============
export interface FeatureCategoryResponse {
  id: number;
  tenant_id: number;
  slug: string;
  icon_key?: string;
  priority: number;
  is_system: boolean;
  created_at: string;
}

// ============= FEATURE =============
export interface FeatureResponse {
  id: number;
  tenant_id: number;
  category_id: number;
  slug: string;
  icon_key?: string;
  is_system: boolean;
  created_at: string;
  translations?: Record<string, any>;
}

export interface FeatureCreate {
  slug: string;
  icon_key?: string;
  is_system?: boolean;
  tenant_id?: number;
  category_id: number;
}

// ============= POST =============
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PostResponse {
  id: number;
  tenant_id: number;
  property_id: number;
  feature_id: number;
  slug: string;
  vr360_url?: string;
  status: PostStatus;
  pinned: boolean;
  cover_media_id?: number;
  published_at?: string;
  created_by?: number;
  created_at: string;
  updated_at?: string;
}

export interface PostCreate {
  slug: string;
  vr360_url?: string;
  status?: PostStatus;
  pinned?: boolean;
  cover_media_id?: number;
  published_at?: string;
  tenant_id?: number;
  property_id: number;
  feature_id: number;
  created_by?: number;
  title: string;
  content_html: string;
  locale?: string;
}

// ============= MEDIA =============
export interface MediaFileResponse {
  id: number;
  tenant_id: number;
  uploader_id?: number;
  kind: string;
  mime_type?: string;
  file_key: string;
  original_filename?: string;
  width?: number;
  height?: number;
  size_bytes?: number;
  alt_text?: string;
  created_at: string;
}

// ============= ANALYTICS =============
export type EventType = 'page_view' | 'click' | 'share';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface TrackingRequest {
  tracking_key: string;
  event_type?: EventType;
  device?: DeviceType;
  user_agent?: string;
  url?: string;
  referrer?: string;
  session_id?: string;
  page_title?: string;
}

export interface DashboardStatsResponse {
  total_page_views: number;
  page_views_growth: number;
  unique_visitors: number;
  categories_this_month: number;
  features_this_month: number;
  period_days: number;
}

// ============= TRANSLATION =============
export interface TranslateRequest {
  texts: string[];
  target?: string;
  source?: string;
  is_html?: boolean;
  concurrent?: number;
  prefer_deepl?: boolean;
  apply_glossary?: boolean;
}

export interface FeatureTranslation {
  feature_id: number;
  locale: string;
  title: string;
  short_desc?: string;
}

export interface PostTranslation {
  post_id: number;
  locale: string;
  title: string;
  subtitle?: string;
  content_html: string;
  seo_title?: string;
  seo_desc?: string;
  og_image_id?: number;
}

// ============= ERROR =============
export interface HTTPValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

// ============= TENANT =============
export interface TenantResponse {
  id: number;
  name: string;
  code: string;
  default_locale: string;
  fallback_locale: string;
  settings_json?: Record<string, any>;
  is_active: boolean;
  plan_id?: number;
  created_at: string;
  updated_at?: string;
}

// ============= LOCALE =============
export interface Locale {
  code: string;
  name: string;
  native_name: string;
}

// ============= PROPERTY LOCALE =============
/**
 * Response từ GET /api/v1/properties/{property_id}/locales
 */
export interface PropertyLocaleResponse {
  id: number;
  tenant_id: number;
  property_id: number;
  locale_code: string;
  is_default: boolean;
  is_active: boolean;
}

/**
 * Response từ GET /api/v1/locales/
 * Danh sách tất cả ngôn ngữ hỗ trợ
 */
export interface LocaleResponse {
  code: string;
  name: string;
  native_name: string;
}

// ============= SETTINGS =============
export interface SettingResponse {
  id: number;
  tenant_id: number;
  property_id: number;
  key_name: string;
  value_json?: Record<string, any>;
}

// ============= ACTIVITY LOG =============
export type ActivityType = 
  | 'login' | 'logout' 
  | 'create_category' | 'update_category' | 'delete_category'
  | 'create_feature' | 'update_feature' | 'delete_feature'
  | 'upload_media' | 'update_media' | 'delete_media'
  | 'create_user' | 'update_user' | 'delete_user'
  | 'create_post' | 'update_post' | 'delete_post' | 'translate_post' | 'publish_post' | 'archive_post'
  | 'create_property' | 'update_property' | 'delete_property'
  | 'user_create_settings' | 'user_update_settings' | 'user_delete_settings'
  | 'create_translation' | 'update_translation' | 'delete_translation'
  | 'analytics_event' | 'system_update';

export interface ActivityLogResponse {
  id: number;
  tenant_id: number;
  activity_type: ActivityType;
  details?: Record<string, any>;
  created_at: string;
}

// ============= PROPERTY POST (Blog) =============
export interface PropertyPostCreate {
  property_id: number;
  status?: string;
  translations?: PropertyPostTranslationCreate[];
}

export interface PropertyPostTranslationCreate {
  locale: string;
  title?: string;
  content?: string;
}

export interface PropertyPostRead {
  id: number;
  property_id: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  translations: PropertyPostTranslationRead[];
}

export interface PropertyPostTranslationRead {
  post_id: number;
  locale: string;
  title?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

// ============= POST WITH TRANSLATION =============
export interface PostWithTranslationResponse extends PostResponse {
  title?: string;
  content_html?: string;
  locale?: string;
  translations?: any[];
}

// ============= FEATURE CATEGORY TRANSLATION =============
export interface FeatureCategoryTranslation {
  category_id: number;
  locale: string;
  title: string;
  short_desc?: string;
}

// ============= PROPERTY TRANSLATION =============
export interface PropertyTranslationResponse {
  id: number;
  property_id: number;
  locale: string;
  property_name?: string;
  slogan?: string;
  description?: string;
  address?: string;
  district?: string;
  city?: string;
  country?: string;
  copyright_text?: string;
  created_at: string;
  updated_at?: string;
}

// ============= EVENT =============
export interface EventCreate {
  locale?: string;
  event_type: EventType;
  device?: DeviceType;
  user_agent?: string;
  ip_hash?: string;
  tenant_id: number;
  property_id: number;
  category_id?: number;
  feature_id?: number;
  post_id?: number;
}

export interface EventResponse extends EventCreate {
  id: number;
  created_at: string;
}

// ============= PLAN =============
export interface PlanResponse {
  id: number;
  code: string;
  name: string;
  features_json?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

// ============= CREATE/UPDATE TYPES =============
export interface PropertyCreate {
  property_name: string;
  code: string;
  default_locale: string;
  slogan?: string;
  description?: string;
  logo_url?: string;
  banner_images?: string[];
  intro_video_url?: string;
  vr360_url?: string;
  address?: string;
  district?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  phone_number?: string;
  email?: string;
  website_url?: string;
  zalo_oa_id?: string;
  facebook_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  google_map_url?: string;
  latitude?: number;
  longitude?: number;
  primary_color?: string;
  secondary_color?: string;
  copyright_text?: string;
  terms_url?: string;
  privacy_url?: string;
  timezone?: string;
  settings_json?: Record<string, any>;
  is_active?: boolean;
  tenant_id?: number;
}

export interface PropertyUpdate extends Partial<PropertyCreate> {}

export interface FeatureCategoryCreate {
  slug: string;
  icon_key?: string;
  priority?: number;
  is_system?: boolean;
  tenant_id?: number;
}

export interface FeatureUpdate {
  slug?: string;
  icon_key?: string;
  category_id?: number;
  is_system?: boolean;
}

export interface PostUpdate {
  slug?: string;
  vr360_url?: string;
  status?: PostStatus;
  pinned?: boolean;
  cover_media_id?: number;
  published_at?: string;
  title?: string;
  content_html?: string;
  locale?: string;
}

// ============= API RESPONSE HELPERS =============
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  detail: string | HTTPValidationError['detail'];
  status_code?: number;
}

// ============= QUERY PARAMS =============
export interface PostsQueryParams {
  property_id?: number;
  feature_id?: number;
  status?: PostStatus;
  skip?: number;
  limit?: number;
  include_translations?: boolean;
}

export interface FeaturesQueryParams {
  category_id?: number;
  skip?: number;
  limit?: number;
  include_system?: boolean;
}

export interface MediaQueryParams {
  skip?: number;
  limit?: number;
}

export interface AnalyticsQueryParams {
  days?: number;
  property_id?: number;
}

// ============= VR HOTEL INTRODUCTION =============
/**
 * Multi-language content structure cho Introduction
 * Keys: 'en', 'vi', 'zh-TW', etc.
 */
export interface IntroductionContent {
  title: string;
  shortDescription: string;
  detailedContent: string;
}

export interface IntroductionContentMap {
  [locale: string]: IntroductionContent;
}

/**
 * Response từ GET /api/v1/vr-hotel/introduction
 */
export interface VRHotelIntroductionResponse {
  isDisplaying: boolean;
  content: IntroductionContentMap;
  vr360Link: string;
  vrTitle: string;
}

// ============= VR HOTEL SETTINGS =============
export interface VrHotelSettingsResponse {
  primary_color: string;
  booking_url: string;
  logo_media_id: number | null;
  favicon_media_id: number | null;
  seo: Record<string, {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
  }>;
  pages: {
    rooms: {
      vr_title: string;
      vr360_link: string;
    };
    dining: {
      vr_title: string;
      vr360_link: string;
    };
    offers: {
      vr_title: string;
      vr360_link: string;
    };
    services: {
      vr_title: string;
      vr360_link: string;
    };
    facilities: {
      vr_title: string;
      vr360_link: string;
    };
  };
}

// ============= MEDIA API TYPES =============
export interface MediaResponse {
  id: number;
  tenant_id: number;
  uploader_id: number | null;
  kind: 'image' | 'video' | 'document';
  mime_type: string;
  file_key: string;
  original_filename: string;
  width: number | null;
  height: number | null;
  size_bytes: number;
  alt_text: string | null;
  created_at: string;
}

export interface GetMediaParams {
  skip?: number;
  limit?: number;
  source?: string;
  folder?: string;
  entity_type?: string;
}

// ============= VR360 TYPES =============
export interface VR360Link {
  id: number;
  property_id: number;
  category: string;
  vr360_link: string;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  vrUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface VR360ListParams {
  limit?: number;
  offset?: number;
  category?: string;
  page?: number;
  roomId?: string;
  facilityId?: string;
  isActive?: boolean;
}

export type VR360CategoryType = 'rooms' | 'dining' | 'facilities' | 'services';

export interface CreateVR360LinkDTO {
  category: VR360CategoryType;
  vr360_link: string;
}

export interface UpdateVR360LinkDTO {
  vr360_link?: string;
}
