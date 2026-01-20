import type { FC, CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { Typography, Grid, Spin, Alert, Tag } from 'antd';
import { CalendarOutlined, MoonOutlined } from '@ant-design/icons';
import { useOffers } from '../../hooks/useOffers';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import type { OfferUIData } from '../../types/offer';

const { Title } = Typography;
const { useBreakpoint } = Grid;

// Translations cho Offers UI
const OFFER_TRANSLATIONS: Record<string, {
  loading: string;
  error: string;
  empty: string;
  discount: string;
  minNights: string;
  validUntil: string;
  expired: string;
  upcoming: string;
}> = {
  vi: {
    loading: 'Đang tải danh sách ưu đãi...',
    error: 'Không thể tải danh sách ưu đãi. Vui lòng thử lại sau.',
    empty: 'Chưa có ưu đãi nào.',
    discount: 'Giảm',
    minNights: 'Tối thiểu',
    validUntil: 'Đến',
    expired: 'Đã hết hạn',
    upcoming: 'Sắp diễn ra',
  },
  en: {
    loading: 'Loading offers...',
    error: 'Could not load offers. Please try again later.',
    empty: 'No offers available.',
    discount: 'Save',
    minNights: 'Min. stay',
    validUntil: 'Until',
    expired: 'Expired',
    upcoming: 'Coming soon',
  },
  zh: {
    loading: '正在加载优惠...',
    error: '无法加载优惠。请稍后再试。',
    empty: '暂无优惠。',
    discount: '折扣',
    minNights: '最少住',
    validUntil: '有效期至',
    expired: '已过期',
    upcoming: '即将开始',
  },
  ja: {
    loading: 'オファーを読み込み中...',
    error: 'オファーを読み込めませんでした。後でもう一度お試しください。',
    empty: 'オファーはありません。',
    discount: '割引',
    minNights: '最低宿泊',
    validUntil: 'まで',
    expired: '期限切れ',
    upcoming: '近日開始',
  },
  ko: {
    loading: '혜택을 불러오는 중...',
    error: '혜택을 불러올 수 없습니다. 나중에 다시 시도해 주세요.',
    empty: '혜택이 없습니다.',
    discount: '할인',
    minNights: '최소 숙박',
    validUntil: '까지',
    expired: '만료됨',
    upcoming: '곧 시작',
  },
  th: {
    loading: 'กำลังโหลดข้อเสนอ...',
    error: 'ไม่สามารถโหลดข้อเสนอได้ กรุณาลองใหม่ภายหลัง',
    empty: 'ยังไม่มีข้อเสนอ',
    discount: 'ส่วนลด',
    minNights: 'พักขั้นต่ำ',
    validUntil: 'ถึง',
    expired: 'หมดอายุ',
    upcoming: 'เร็วๆ นี้',
  },
  // Default fallback
  default: {
    loading: 'Loading offers...',
    error: 'Could not load offers.',
    empty: 'No offers available.',
    discount: 'Save',
    minNights: 'Min. stay',
    validUntil: 'Until',
    expired: 'Expired',
    upcoming: 'Coming soon',
  },
};

const getOfferTranslations = (locale: string) => {
  return OFFER_TRANSLATIONS[locale] || OFFER_TRANSLATIONS['default'];
};

interface OfferListProps {
  onOfferClick?: (offer: OfferUIData) => void;
  className?: string;
  limit?: number;
}

export const OfferList: FC<OfferListProps> = memo(({ 
  onOfferClick,
  className = '',
  limit = 100,
}) => {
  const screens = useBreakpoint();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();
  const { primaryColor } = useTheme();
  const t = getOfferTranslations(locale);

  // Memoize params
  const params = useMemo(() => ({
    limit,
    status: 'active',
  }), [limit]);

  // Fetch offers từ API
  const { offers, loading, error } = useOffers({
    propertyId: propertyId ?? undefined,
    locale,
    params,
  });

  // Styles
  const wrapperStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    overflow: 'hidden',
  };

  const postStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    margin: '12px 0 9px 0',
    padding: '12px',
    height: 'auto',
    borderBottom: '1px solid rgba(153, 113, 42, 0.5)',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    cursor: onOfferClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  };

  const titleStyle: CSSProperties = {
    color: primaryColor,
    fontSize: screens.md ? 16 : 14,
    fontFamily: "'UTMCafeta', 'UTMNeoSansIntel', Arial, sans-serif",
    margin: 0,
    fontWeight: 'normal',
    lineHeight: 1.3,
    flex: 1,
  };

  const discountBadgeStyle: CSSProperties = {
    background: primaryColor,
    color: '#000',
    padding: '4px 12px',
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: screens.md ? 14 : 12,
    whiteSpace: 'nowrap',
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

  const metaStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  };

  const tagStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className={`offer-list ${className}`} style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>{t.loading}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`offer-list ${className}`}>
        <Alert
          type="error"
          message={t.error}
          style={{ background: 'rgba(255, 77, 79, 0.1)', border: '1px solid rgba(255, 77, 79, 0.3)' }}
        />
      </div>
    );
  }

  // Empty state - để trống khi không có dữ liệu
  if (offers.length === 0) {
    return null;
  }

  return (
    <div className={`offer-list ${className}`} style={wrapperStyle}>
      {offers.map((offer, index) => (
        <article 
          key={offer.id} 
          className="offer-item"
          style={{
            ...postStyle,
            borderBottom: index === offers.length - 1 ? 'none' : postStyle.borderBottom,
          }}
          onClick={() => onOfferClick?.(offer)}
          onMouseEnter={(e) => {
            if (onOfferClick) {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.transform = 'translateX(4px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          {/* Header: Title + Discount Badge */}
          <div style={headerStyle}>
            <Title level={4} style={titleStyle} className="offer-title">
              {offer.title}
            </Title>
            <div style={discountBadgeStyle}>
              {t.discount} {offer.discountDisplay}
            </div>
          </div>

          {/* Description */}
          <p style={descriptionStyle} className="offer-description">
            {offer.description}
          </p>

          {/* Meta info: Date range, Min nights */}
          <div style={metaStyle}>
            {/* Valid until */}
            <Tag icon={<CalendarOutlined />} style={tagStyle}>
              {t.validUntil} {formatDate(offer.validTo)}
            </Tag>
            
            {/* Min nights (chỉ hiện nếu > 0) */}
            {offer.minNights > 0 && (
              <Tag icon={<MoonOutlined />} style={tagStyle}>
                {t.minNights} {offer.minNights} {locale === 'vi' ? 'đêm' : locale === 'en' ? 'nights' : '晚'}
              </Tag>
            )}
          </div>
        </article>
      ))}
    </div>
  );
});

OfferList.displayName = 'OfferList';

export default OfferList;
