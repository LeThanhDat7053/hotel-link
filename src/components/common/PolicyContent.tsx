import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Typography, Spin, Alert } from 'antd';
import { usePolicy } from '../../hooks/usePolicy';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';

const { Paragraph } = Typography;

interface PolicyContentProps {
  className?: string;
}

export const PolicyContent: FC<PolicyContentProps> = memo(({ className = '' }) => {
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Fetch policy data from API
  const { content, loading, error } = usePolicy(propertyId || 0, locale);

  // Container styles
  const containerStyle: CSSProperties = {
    float: 'left' as const,
    width: '100%',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    textAlign: 'justify' as const,
  };

  // Paragraph style
  const paragraphStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: '22px',
    textAlign: 'justify' as const,
    marginBottom: 12,
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Spin size="large" />
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>Đang tải chính sách...</p>
      </div>
    );
  }

  // Lỗi API
  if (error) {
    return (
      <Alert
        title="Lỗi"
        message={error.message || "Không thể tải thông tin chính sách"}
        type="error"
        showIcon
        style={{ margin: '16px 0' }}
      />
    );
  }

  // Không có dữ liệu - để trống
  if (!content) {
    return null;
  }

  // Tách detailedContent thành các đoạn
  const paragraphs = content.detailedContent.split('\n\n').filter(p => p.trim());

  return (
    <div className={`policy-content ${className}`} style={containerStyle}>
      {content.shortDescription && (
        <Paragraph style={{ ...paragraphStyle, fontWeight: 500 }}>
          {content.shortDescription}
        </Paragraph>
      )}

      <div className="page-content">
        {paragraphs.map((paragraph, index) => (
          <Paragraph 
            key={index} 
            style={paragraphStyle}
          >
            {paragraph}
          </Paragraph>
        ))}
      </div>
    </div>
  );
});

PolicyContent.displayName = 'PolicyContent';
