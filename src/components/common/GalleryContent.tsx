import type { FC, CSSProperties } from 'react';
import { memo, useState, useCallback, useMemo } from 'react';
import { Grid, Spin, Alert } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import { useGallery } from '../../hooks/useGallery';
import { mediaService } from '../../services/mediaService';
import { ImageGalleryViewer } from './ImageGalleryViewer';

const { useBreakpoint } = Grid;

interface GalleryContentProps {
  className?: string;
}

export const GalleryContent: FC<GalleryContentProps> = memo(({ 
  className = '',
}) => {
  const { primaryColor } = useTheme();
  const screens = useBreakpoint();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [galleryVisible, setGalleryVisible] = useState(false);

  // Fetch media từ API (source='vr_hotel', chỉ images)
  const { media, loading, error } = useGallery({
    params: {
      limit: 100,
    },
  });

  // Transform media thành array of image URLs
  const allImages = useMemo(() => {
    if (media.length === 0) return [];
    
    const urls = media.map(m => mediaService.getMediaUrl(m.id));
    return urls;
  }, [media]);

  // Open gallery viewer at specific index
  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setGalleryVisible(true);
  }, []);

  // Close gallery viewer
  const handleCloseGallery = useCallback(() => {
    setGalleryVisible(false);
  }, []);

  // Container styles
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    maxHeight: screens.md ? 272 : 220,
    paddingRight: 16,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    maxWidth: '100%',
    paddingBottom: 6,
  };

  const galleryGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: screens.md ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
    gap: screens.md ? 10 : 6,
    padding: screens.md ? 5 : 3,
  };

  const imageItemStyle: CSSProperties = {
    position: 'relative' as const,
    paddingBottom: '75%', // Aspect ratio 4:3
    overflow: 'hidden',
    cursor: 'pointer',
    borderRadius: 4,
    background: 'rgba(0, 0, 0, 0.3)',
  };

  const imageStyle: CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.3s ease',
  };

  // Loading state
  if (loading) {
    return (
      <div className={`gallery-content ${className}`} style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải thư viện ảnh...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`gallery-content ${className}`}>
        <Alert
          type="error"
          message="Không thể tải thư viện ảnh. Vui lòng thử lại sau."
          style={{ background: 'rgba(255, 77, 79, 0.1)', border: '1px solid rgba(255, 77, 79, 0.3)' }}
        />
      </div>
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (allImages.length === 0) {
    return null;
  }

  return (
    <div className={`gallery-content ${className}`}>
      <div className="nicescroll-bg" style={containerStyle}>
        <div style={galleryGridStyle}>
          {allImages.map((imageUrl, index) => (
            <div
              key={index}
              style={imageItemStyle}
              onClick={() => handleImageClick(index)}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                src={imageUrl}
                alt={`Gallery ${index + 1}`}
                style={imageStyle}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Gallery Viewer */}
      <ImageGalleryViewer
        images={allImages}
        visible={galleryVisible}
        onClose={handleCloseGallery}
        initialIndex={selectedImageIndex}
      />

      {/* Custom scrollbar styles */}
      <style>{`
        .gallery-content .nicescroll-bg::-webkit-scrollbar {
          width: 2px;
        }
        .gallery-content .nicescroll-bg::-webkit-scrollbar-thumb {
          background: ${primaryColor}80;
        }
        .gallery-content .nicescroll-bg::-webkit-scrollbar-track {
          background: rgba(251, 228, 150, 0);
        }
      `}</style>
    </div>
  );
});

GalleryContent.displayName = 'GalleryContent';
