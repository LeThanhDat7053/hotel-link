import type { FC, CSSProperties } from 'react';
import { memo, useState, useEffect } from 'react';
import { Button, Grid, Spin, Alert, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import { ImageGalleryViewer } from './ImageGalleryViewer';
import type { DiningUIData } from '../../types/dining';

const { useBreakpoint } = Grid;

interface DiningDetailProps {
  dining: DiningUIData | null;
  loading?: boolean;
  error?: Error | null;
  onBack: () => void;
  onVrLinkChange?: (vrLink: string | null) => void;
  className?: string;
}

export const DiningDetail: FC<DiningDetailProps> = memo(({ 
  dining,
  loading = false,
  error = null,
  onBack,
  onVrLinkChange,
  className = '',
}) => {
  const screens = useBreakpoint();
  const { primaryColor } = useTheme();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  // Đổi VR360 background khi vào chi tiết ẩm thực
  useEffect(() => {
    if (dining?.vrLink && onVrLinkChange) {
      onVrLinkChange(dining.vrLink);
    }
    // Cleanup: reset về null khi unmount
    return () => {
      if (onVrLinkChange) {
        onVrLinkChange(null);
      }
    };
  }, [dining?.vrLink, onVrLinkChange]);

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

  // Loading state
  if (loading) {
    return (
      <div className={`dining-detail ${className}`} style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải chi tiết ẩm thực...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`dining-detail ${className}`}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={backButtonStyle}
        >
          Quay lại
        </Button>
        <Alert
          type="error"
          title="Lỗi tải dữ liệu"
          message={error.message || 'Không thể tải thông tin ẩm thực. Vui lòng thử lại sau.'}
        />
      </div>
    );
  }

  // Empty/Not found state
  if (!dining) {
    return (
      <div className={`dining-detail ${className}`}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={backButtonStyle}
        >
          Quay lại
        </Button>
        <Alert
          type="info"
          title="Không tìm thấy"
          message="Thông tin ẩm thực không tồn tại."
        />
      </div>
    );
  }

  // Tách description thành các đoạn bằng dấu xuống dòng
  const paragraphs = dining.description.split('\n\n').filter(p => p.trim());

  return (
    <div className={`dining-detail ${className}`} style={containerStyle}>
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={backButtonStyle}
        className="dining-back-btn"
      >
        {t.back}
      </Button>

      {/* Nội dung chi tiết - chỉ là thẻ <p> đơn giản */}
      <div className="page-content">
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            style={index === 0 ? firstParagraphStyle : paragraphStyle}
          >
            {paragraph}
          </p>
        ))}

        {/* Operating Hours - from API */}
        {dining.operatingHours && (
          <p style={{ 
            color: primaryColor, 
            fontSize: screens.md ? 13 : 11, 
            fontWeight: 500,
            marginTop: 16 
          }}>
            {t.operatingHours}: <strong>{dining.operatingHours}</strong>
          </p>
        )}

        {/* Gallery Images nếu có */}
        {dining.galleryImages && dining.galleryImages.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ color: primaryColor, fontSize: screens.md ? 15 : 13, marginBottom: 8 }}>{t.images}</h4>
            <div style={galleryContainerStyle}>
              {dining.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  style={{ cursor: 'pointer', borderRadius: 4, overflow: 'hidden' }}
                  onClick={() => openGallery(idx)}
                >
                  <Image
                    src={img}
                    alt={`${dining.name} - Image ${idx + 1}`}
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
        images={dining.galleryImages}
        initialIndex={galleryIndex}
        visible={galleryOpen}
        onClose={closeGallery}
      />
    </div>
  );
});

DiningDetail.displayName = 'DiningDetail';
