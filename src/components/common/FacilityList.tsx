import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Image, Typography, Grid, Spin, Alert } from 'antd';
import { useFacilities } from '../../hooks/useFacility';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';import { useTheme } from '../../context/ThemeContext';import type { FacilityUIData } from '../../types/facility';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface FacilityListProps {
  onFacilityClick?: (facility: FacilityUIData) => void;
  className?: string;
  limit?: number;
  facilityType?: string;
}

export const FacilityList: FC<FacilityListProps> = memo(({ 
  onFacilityClick,
  className = '',
  limit = 100,
  facilityType,
}) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();

  // Memoize params để tránh re-render vô hạn
  const params = useMemo(() => ({
    limit,
    facility_type: facilityType,
  }), [limit, facilityType]);

  // Fetch facilities từ API
  const { facilities, loading, error } = useFacilities({
    propertyId,
    locale,
    params,
  });

  // Wrapper styles - bọc tất cả các item
  const wrapperStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    overflow: 'hidden',
  };

  // Post/Item styles - từng tiện ích
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
        message={error instanceof Error ? error.message : 'Có lỗi xảy ra'}
        type="error"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (facilities.length === 0) {
    return null;
  }

  return (
    <div className={`facility-list ${className}`} style={wrapperStyle}>
      {facilities.map((facility, index) => {
        // Generate dynamic fallback SVG with primaryColor
        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="100" height="70" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="70" fill="#1a1a2e"/><text x="50" y="40" fill="${primaryColor}" text-anchor="middle" font-size="8">Facility</text></svg>`)}`;
        
        return (
          <article 
          key={facility.id} 
          className="facility-item"
          style={{
            ...postStyle,
            borderBottom: index === facilities.length - 1 ? 'none' : postStyle.borderBottom,
            cursor: onFacilityClick ? 'pointer' : 'default',
          }}
          onClick={() => onFacilityClick?.(facility)}
        >
          {/* Thumbnail - Bên trái */}
          <div className="facility-thumbnail" style={thumbnailStyle}>
            <Image
              src={facility.primaryImage || undefined}
              alt={facility.name}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
              fallback={fallbackSvg}
            />
          </div>

          {/* Content - Bên phải */}
          <div className="facility-content" style={contentStyle}>
            <header className="facility-header">
              <Title 
                level={4} 
                style={titleStyle}
                className="facility-title"
              >
                {facility.name}
              </Title>
            </header>
            <p style={descriptionStyle} className="facility-description">
              {facility.description}
            </p>
          </div>
        </article>
        );
      })}
    </div>
  );
});

FacilityList.displayName = 'FacilityList';
