import type { FC, CSSProperties } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { Typography, Button, Grid, Spin, Alert } from 'antd';
import { 
  HomeOutlined, 
  ExpandOutlined, 
  RestOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import { usePropertyData } from '../../context/PropertyContext';
import { useVrHotelSettings } from '../../hooks/useVR360';
import { ImageGalleryViewer } from './ImageGalleryViewer';
import type { RoomUIData } from '../../types/room';

const { Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

interface RoomDetailProps {
  room: RoomUIData | null;
  loading?: boolean;
  error?: Error | null;
  onBack?: () => void;
  onVrLinkChange?: (vrLink: string | null) => void;
  className?: string;
  roomCode?: string;
}

export const RoomDetail: FC<RoomDetailProps> = memo(({ 
  room,
  onVrLinkChange,
  loading = false,
  error = null,
  onBack,
  className = '',
}) => {
  const screens = useBreakpoint();
  const { primaryColor } = useTheme();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);
  const { propertyId } = usePropertyData();
  const { settings } = useVrHotelSettings(propertyId);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Icon mapping helper with dynamic color
  const iconStyle = { fontSize: 14, marginRight: 8, color: primaryColor };
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'capacity': return <UserOutlined style={iconStyle} />;
      case 'area': return <ExpandOutlined style={iconStyle} />;
      case 'floor': return <HomeOutlined style={iconStyle} />;
      case 'bed': return <RestOutlined style={iconStyle} />;
      case 'price': return <DollarOutlined style={iconStyle} />;
      default: return <HomeOutlined style={iconStyle} />;
    }
  };

  const openGallery = useCallback((index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  }, []);

  const closeGallery = useCallback(() => {
    setGalleryOpen(false);
  }, []);

  // Chuyển đến trang đặt phòng - redirect to external booking URL in new tab
  const handleBooking = useCallback(() => {
    if (!settings?.booking_url) return;
    window.open(settings.booking_url, '_blank', 'noopener,noreferrer');
  }, [settings?.booking_url]);

  // Đổi VR360 background khi vào chi tiết phòng
  useEffect(() => {
    if (room?.vrLink && onVrLinkChange) {
      onVrLinkChange(room.vrLink);
    }
    // Cleanup: reset về null khi unmount
    return () => {
      if (onVrLinkChange) {
        onVrLinkChange(null);
      }
    };
  }, [room?.vrLink, onVrLinkChange]);

  // Styles
  const scrollContainerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    maxHeight: screens.md ? 272 : 220,
    paddingRight: 16,
    overflowY: 'auto',
    overflowX: 'hidden',
    maxWidth: '100%',
    paddingBottom: 6,
  };

  const descriptionStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: screens.md ? 14 : 12,
    lineHeight: screens.md ? '22px' : '18px',
    textAlign: 'justify' as const,
    margin: 0,
    marginBottom: 16,
  };

  const priceContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    padding: '12px 16px',
    background: `${primaryColor}26`,
    borderRadius: 8,
  };

  const priceTextStyle: CSSProperties = {
    color: primaryColor,
    fontSize: screens.md ? 15 : 13,
    margin: 0,
  };

  const roomInfoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: screens.md ? 13 : 11,
    marginBottom: 8,
    paddingLeft: 4,
  };

  const sectionTitleStyle: CSSProperties = {
    color: primaryColor,
    fontSize: screens.md ? 14 : 12,
    fontWeight: 500,
    marginTop: 16,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: `1px solid ${primaryColor}80`,
  };

  const amenitiesListStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '4px 12px',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  };

  const amenityItemStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: screens.md ? 12 : 10,
    lineHeight: '18px',
    position: 'relative' as const,
    paddingLeft: 12,
  };

  const galleryContainerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 5,
    marginTop: 10,
  };


  // Loading state
  if (loading) {
    return (
      <div className={`room-detail ${className}`} style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải chi tiết phòng...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`room-detail ${className}`}>
        {onBack && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{ 
              color: primaryColor, 
              padding: '0 0 8px 0',
              fontSize: screens.md ? 13 : 11,
            }}
          >
            {t.back}
          </Button>
        )}
        <Alert
          type="error"
          title={t.errorLoading}
          message={error.message || t.errorLoading}
        />
      </div>
    );
  }

  // Empty/Not found state
  if (!room) {
    return (
      <div className={`room-detail ${className}`}>
        {onBack && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{ 
              color: primaryColor, 
              padding: '0 0 8px 0',
              fontSize: screens.md ? 13 : 11,
            }}
          >
            Quay lại
          </Button>
        )}
        <Alert
          type="warning"
          title={t.notFound}
          message={t.notFound}
        />
      </div>
    );
  }

  // Format price
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(room.price);

  return (
    <div className={`room-detail ${className}`}>
      {/* Back button */}
      {onBack && (
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ 
            color: primaryColor, 
            padding: '0 0 8px 0',
            fontSize: screens.md ? 13 : 11,
          }}
        >
          {t.back}
        </Button>
      )}

      {/* Scrollable content */}
      <div className="nicescroll-bg" style={scrollContainerStyle}>
        {/* Description */}
        <Paragraph style={descriptionStyle}>
          {room.description}
        </Paragraph>

        {/* Price & Booking - Chỉ hiển thị khi giá > 0 */}
        {room.price > 0 && (
          <div style={priceContainerStyle}>
            <Text style={priceTextStyle}>
              {t.pricePerNight}: <strong>{formattedPrice}</strong>/{t.night}
            </Text>
            <Button 
              type="primary"
              size="small"
              onClick={handleBooking}
              style={{ 
                background: primaryColor, 
                borderColor: primaryColor,
                color: '#000',
                fontWeight: 500,
                fontSize: screens.md ? 12 : 10,
              }}
            >
              {t.bookNow}
            </Button>
          </div>
        )}

        {/* Room Info */}
        <div className="room-info">
          {room.capacity > 0 && (
            <div style={roomInfoStyle}>
              {getIcon('capacity')}
              <span>{t.capacity}: <strong>{room.capacity} {t.people}</strong></span>
            </div>
          )}
          {room.size > 0 && (
            <div style={roomInfoStyle}>
              {getIcon('area')}
              <span>{t.area}: <strong>{room.size}m²</strong></span>
            </div>
          )}
          {room.floor !== null && (
            <div style={roomInfoStyle}>
              {getIcon('floor')}
              <span>{t.floor}: <strong>{room.floor}</strong></span>
            </div>
          )}
          {room.bedType && (
            <div style={roomInfoStyle}>
              {getIcon('bed')}
              <span>{t.bedType}: <strong>{room.bedType}</strong></span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {room.amenities.length > 0 && (
          <>
            <div style={sectionTitleStyle}>{t.amenities}</div>
            <ul style={amenitiesListStyle}>
              {room.amenities.map((amenity, index) => (
                <li key={index} style={amenityItemStyle}>
                  <span style={{ 
                    position: 'absolute', 
                    left: 0, 
                    color: primaryColor 
                  }}>•</span>
                  {amenity}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Gallery - Ảnh chi tiết (is_primary=false) */}
        {room.galleryImages.length > 0 && (
          <>
            <div style={sectionTitleStyle}>{t.images}</div>
            <div style={galleryContainerStyle}>
              {room.galleryImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => openGallery(index)}
                  style={{ 
                    width: '100%', 
                    aspectRatio: '1/1',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* Image Gallery Viewer - Fullscreen */}
      <ImageGalleryViewer
        images={room.galleryImages}
        initialIndex={galleryIndex}
        visible={galleryOpen}
        onClose={closeGallery}
      />

      {/* Custom scrollbar styles */}
      <style>{`
        .room-detail .nicescroll-bg::-webkit-scrollbar {
          width: 2px;
        }
        .room-detail .nicescroll-bg::-webkit-scrollbar-thumb {
          background: ${primaryColor}80;
        }
        .room-detail .nicescroll-bg::-webkit-scrollbar-track {
          background: rgba(251, 228, 150, 0);
        }
      `}</style>
    </div>
  );
});

RoomDetail.displayName = 'RoomDetail';
