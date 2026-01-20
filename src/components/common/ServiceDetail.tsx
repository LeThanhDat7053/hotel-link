import type { FC, CSSProperties } from 'react';
import { memo, useState, useEffect } from 'react';
import { Button, Grid, Spin, Alert, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import { ImageGalleryViewer } from './ImageGalleryViewer';
import type { ServiceUIData } from '../../types/service';

const { useBreakpoint } = Grid;

interface ServiceDetailProps {
  service: ServiceUIData | null;
  loading?: boolean;
  error?: Error | null;
  onBack: () => void;
  onVrLinkChange?: (vrLink: string | null) => void;
  className?: string;
}

export const ServiceDetail: FC<ServiceDetailProps> = memo(({ 
  service,
  loading = false,
  error = null,
  onBack,
  onVrLinkChange,
  className = '' 
}) => {
  const screens = useBreakpoint();  const { primaryColor } = useTheme();  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  // Đổi VR360 background khi vào chi tiết dịch vụ
  useEffect(() => {
    if (service?.vrLink && onVrLinkChange) {
      onVrLinkChange(service.vrLink);
    }
    // Cleanup: reset về null khi unmount
    return () => {
      if (onVrLinkChange) {
        onVrLinkChange(null);
      }
    };
  }, [service?.vrLink, onVrLinkChange]);

  // Container styles theo CSS được cung cấp
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    textAlign: 'justify' as const,
  };

  // Back button style
  const backButtonStyle: CSSProperties = {
    marginBottom: 16,
    color: primaryColor,
    borderColor: `${primaryColor}80`,
    backgroundColor: 'transparent',
    fontSize: screens.md ? 13 : 12,
  };

  // Paragraph style theo CSS được cung cấp
  const paragraphStyle: CSSProperties = {
    background: 'transparent',
    outline: 'none',
    margin: '0 auto',
    padding: 0,
    border: 'none',
    fontSize: '100%',
    font: 'inherit',
    verticalAlign: 'baseline',
    display: 'block',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInlineStart: 0,
    marginInlineEnd: 0,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '22px',
    textAlign: 'justify' as const,
  };

  // First paragraph không có margin top
  const firstParagraphStyle: CSSProperties = {
    ...paragraphStyle,
    marginBlockStart: 0,
  };

  const galleryContainerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 5,
    marginTop: 10,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={backButtonStyle}
        >
          Quay lại
        </Button>
        <Alert
          title="Lỗi"
          message={error?.message || "Không tìm thấy dịch vụ"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Tách description thành các đoạn bằng dấu xuống dòng
  const paragraphs = service.description ? service.description.split('\n\n').filter(p => p.trim()) : [];
  const galleryImages = service.galleryImages || [];

  return (
    <div className={`service-detail ${className}`} style={containerStyle}>
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={backButtonStyle}
        className="service-back-btn"
      >
        {t.back}
      </Button>

      {/* Nội dung chi tiết */}
      <div className="page-content">
        {/* Availability - từ API */}
        {service.availability && (
          <p style={{ 
            color: primaryColor, 
            fontSize: screens.md ? 13 : 11, 
            marginBottom: 4,
            fontWeight: 500,
          }}>
            {t.availability}: <strong>{service.availability}</strong>
          </p>
        )}

        {/* Price Info - từ API */}
        {service.priceInfo && (
          <p style={{ 
            color: primaryColor, 
            fontSize: screens.md ? 13 : 11, 
            marginBottom: 12,
            fontWeight: 500,
          }}>
            {t.priceInfo}: <strong>{Number(service.priceInfo).toLocaleString()} VNĐ</strong>
          </p>
        )}

        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            style={index === 0 ? firstParagraphStyle : paragraphStyle}
          >
            {paragraph}
          </p>
        ))}

        {/* Gallery images */}
        {galleryImages.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ color: primaryColor, fontSize: screens.md ? 15 : 13, marginBottom: 8 }}>{t.images}</h4>
            <div style={galleryContainerStyle}>
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  style={{ cursor: 'pointer', borderRadius: 4, overflow: 'hidden' }}
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={img}
                    alt={`${service.name} - Ảnh ${index + 1}`}
                    width="100%"
                    height={80}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Viewer - Fullscreen */}
      <ImageGalleryViewer
        images={galleryImages}
        initialIndex={galleryIndex}
        visible={galleryOpen}
        onClose={closeGallery}
      />
    </div>
  );
});

ServiceDetail.displayName = 'ServiceDetail';
