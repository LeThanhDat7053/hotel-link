import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Spin, Alert } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
import type { ContactUIData } from '../../types/contact';

interface ContactContentProps {
  className?: string;
  content: ContactUIData | null;
  loading?: boolean;
  error?: Error | null;
}

export const ContactContent: FC<ContactContentProps> = memo(({ 
  className = '',
  content,
  loading: dataLoading = false,
  error = null
}) => {
  const { primaryColor } = useTheme();
  const { locale } = useLanguage();
  const t = getMenuTranslations(locale);

  // Container styles
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
  };

  // Contact info styles (thẻ 1)
  const contactInfoStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    lineHeight: '22px',
    color: 'rgba(255, 255, 255, 0.8)',
  };

  // Contact message styles (thẻ 2)
  const contactMesStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    marginTop: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '22px',
  };

  // Link styles
  const linkStyle: CSSProperties = {
    color: primaryColor,
    textDecoration: 'none',
  };

  // Strong text style
  const strongStyle: CSSProperties = {
    color: '#fff',
    fontWeight: 'bold',
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className={`contact-content ${className}`} style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`contact-content ${className}`} style={{ padding: '20px' }}>
        <Alert
          title="Lỗi"
          message={error.message || 'Không thể tải thông tin liên hệ'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // No content - để trống khi không có dữ liệu
  if (!content) {
    return null;
  }

  return (
    <div className={`contact-content contact-page ${className}`} style={containerStyle}>
      {/* Thẻ 1: Contact Info */}
      <p className="contact-info-bg" style={contactInfoStyle}>
        <span style={strongStyle}>{t.address}:</span> {content.address || t.notAvailable}
        <br />
        <span style={strongStyle}>{t.email}:</span>{' '}
        {content.email ? (
          <a href={`mailto:${content.email}`} style={linkStyle}>
            {content.email}
          </a>
        ) : (
          t.notAvailable
        )}
        <br />
        <span style={strongStyle}>{t.phone}:</span>{' '}
        {content.phone ? (
          <a href={`tel:${content.phone}`} style={linkStyle}>
            {content.phone}
          </a>
        ) : (
          t.notAvailable
        )}
        {content.website && (
          <>
            <br />
            <span style={strongStyle}>{t.website}:</span>{' '}
            <a href={content.website} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {content.website}
            </a>
          </>
        )}
        {content.workingHours && (
          <>
            <br />
            <span style={strongStyle}>{t.workingHours}:</span> {content.workingHours}
          </>
        )}
      </p>

      {/* Thẻ 2: Contact Message - chỉ hiển thị nếu có description từ API */}
      {content.description && (
        <p className="contact-mes" style={contactMesStyle}>
          {content.description}
        </p>
      )}
    </div>
  );
});

ContactContent.displayName = 'ContactContent';
