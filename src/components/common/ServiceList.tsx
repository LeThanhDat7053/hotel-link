import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Image, Typography, Grid, Spin, Alert } from 'antd';
import { useServices } from '../../hooks/useService';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';import { useTheme } from '../../context/ThemeContext';import type { ServiceUIData } from '../../types/service';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface ServiceListProps {
  onServiceClick?: (service: ServiceUIData) => void;
  className?: string;
  limit?: number;
  serviceType?: string;
}

export const ServiceList: FC<ServiceListProps> = memo(({ 
  onServiceClick,
  className = '',
  limit = 100,
  serviceType,
}) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();

  // Memoize params để tránh re-render vô hạn
  const params = useMemo(() => ({
    limit,
    service_type: serviceType,
  }), [limit, serviceType]);

  // Fetch services từ API
  const { services, loading, error } = useServices({
    propertyId: propertyId || 0,
    locale,
    params,
  });

  // Wrapper styles - bọc tất cả các item
  const wrapperStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    overflow: 'hidden',
  };

  // Post/Item styles - từng dịch vụ
  const postStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    margin: '12px 0 9px 0',
    padding: '0 0 6px 0',
    height: 'auto',
    borderBottom: '1px solid rgba(153, 113, 42, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    gap: screens.md ? 15 : 10,
  };

  const thumbnailStyle: CSSProperties = {
    flexShrink: 0,
    width: screens.md ? 100 : 80,
    height: screens.md ? 70 : 56,
    borderRadius: 6,
    overflow: 'hidden',
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const titleStyle: CSSProperties = {
    color: primaryColor,
    fontSize: screens.md ? 15 : 13,
    fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
    margin: 0,
    marginBottom: 4,
    fontWeight: 'normal',
    lineHeight: 1.3,
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  };

  const descriptionStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: screens.md ? 13 : 11,
    lineHeight: screens.md ? '18px' : '16px',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        title="Lỗi"
        message={error}
        type="error"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (services.length === 0) {
    return null;
  }

  return (
    <div className={`service-list ${className}`} style={wrapperStyle}>
      {services.map((service, index) => {
        // Generate dynamic fallback SVG with primaryColor
        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="70" fill="#1a1a2e"/><text x="50" y="40" fill="${primaryColor}" text-anchor="middle" font-size="9">Service</text></svg>`)}`;
        
        return (
          <article 
          key={service.id} 
          className="service-item"
          style={{
            ...postStyle,
            borderBottom: index === services.length - 1 ? 'none' : postStyle.borderBottom,
            cursor: onServiceClick ? 'pointer' : 'default',
          }}
          onClick={() => onServiceClick?.(service)}
        >
          {/* Thumbnail - Bên trái */}
          <div className="service-thumbnail" style={thumbnailStyle}>
            <Image
              src={service.primaryImage || undefined}
              alt={service.name}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback={fallbackSvg}
            />
          </div>

          {/* Content - Bên phải */}
          <div className="service-content" style={contentStyle}>
            <header className="service-header">
              <Title 
                level={4} 
                style={titleStyle}
                className="service-title"
              >
                {service.name}
              </Title>
            </header>
            <p style={descriptionStyle} className="service-description">
              {service.description}
            </p>
          </div>
        </article>
        );
      })}
    </div>
  );
});

ServiceList.displayName = 'ServiceList';
