/**
 * useGallery Hook - Fetch media files for gallery
 */

import { useState, useEffect, useCallback } from 'react';
import type { MediaResponse, GetMediaParams } from '../types/api';
import { mediaService } from '../services/mediaService';

interface UseGalleryOptions {
  params?: GetMediaParams;
  enabled?: boolean;
}

interface UseGalleryResult {
  media: MediaResponse[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook để fetch media files cho gallery
 * Tự động filter theo source='vr_hotel' và tenant hiện tại
 */
export function useGallery({
  params,
  enabled = true,
}: UseGalleryOptions = {}): UseGalleryResult {
  const [media, setMedia] = useState<MediaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMedia = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi API với source='vr_hotel' - tenant code tự động từ api interceptor
      const data = await mediaService.getVRHotelMedia(params);
      
      // Filter chỉ lấy images (kind='image')
      const images = data.filter(item => item.kind === 'image');
      
      setMedia(images);
    } catch (err) {
      console.error('[useGallery] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [enabled, params?.skip, params?.limit, params?.folder, params?.entity_type]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return {
    media,
    loading,
    error,
    refetch: fetchMedia,
  };
}
