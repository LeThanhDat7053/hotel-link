/**
 * AboutContent - Component hiển thị nội dung trang Giới thiệu
 * 
 * Kết nối với API: GET /api/v1/vr-hotel/introduction
 * Hỗ trợ multi-language với fallback từ locale -> 'vi' -> 'en'
 * Tự động cập nhật khi user đổi ngôn ngữ qua LanguageContext
 */

import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Typography, Skeleton, Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useIntroductionContent } from '../../hooks/useIntroduction';
import { usePropertyData } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';

const { Paragraph } = Typography;

interface AboutContentProps {
  className?: string;
}

export const AboutContent: FC<AboutContentProps> = memo(({ 
  className = ''
}) => {
  // Lấy locale từ LanguageContext
  const { locale } = useLanguage();
  
  // Lấy propertyId từ PropertyContext
  const { propertyId, loading: propertyLoading } = usePropertyData();
  
  // Fetch introduction content với locale động
  const { content, loading, error, refetch } = useIntroductionContent(propertyId, locale);

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

  // Loading state - cả property và introduction
  if (loading || propertyLoading || !propertyId) {
    return (
      <div className={`about-content ${className}`} style={containerStyle}>
        <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 5 }} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`about-content ${className}`} style={containerStyle}>
        <Alert
          type="error"
          title="Không thể tải nội dung"
          description={error.message}
          action={
            <Button 
              size="small" 
              icon={<ReloadOutlined />} 
              onClick={() => refetch()}
            >
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  // No content available - để trống khi không có dữ liệu
  if (!content) {
    return null;
  }

  // NOTE: Tạm bỏ check isDisplaying để dev có thể thấy content
  // Khi production, có thể bật lại nếu cần
  // if (!isDisplaying) {
  //   return (
  //     <div className={`about-content ${className}`} style={containerStyle}>
  //       <Alert
  //         type="info"
  //         title="Nội dung tạm thời không hiển thị"
  //         description="Nội dung giới thiệu đang được cập nhật."
  //       />
  //     </div>
  //   );
  // }

  /**
   * Parse detailedContent với line breaks
   * Backend trả về string với \n\n cho paragraph breaks
   */
  const renderDetailedContent = (text: string) => {
    if (!text) return null;

    // Split by double newline for paragraphs
    const paragraphs = text.split('\n\n').filter(Boolean);

    return paragraphs.map((paragraph, index) => {
      // Check if this is a list (contains bullet points with -)
      const lines = paragraph.split('\n');
      
      // If paragraph has multiple lines starting with "-", render as list
      const isList = lines.length > 1 && lines.some(line => line.trim().startsWith('-'));
      
      if (isList) {
        const listTitle = lines.find(line => !line.trim().startsWith('-'));
        const listItems = lines.filter(line => line.trim().startsWith('-'));
        
        return (
          <div key={index} style={{ marginBottom: 16 }}>
            {listTitle && (
              <Paragraph style={{ ...paragraphStyle, marginBottom: 8, fontWeight: 500 }}>
                {listTitle}
              </Paragraph>
            )}
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} style={{ ...paragraphStyle, marginBottom: 4 }}>
                  {item.replace(/^-\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Regular paragraph
      return (
        <Paragraph key={index} style={paragraphStyle}>
          {paragraph}
        </Paragraph>
      );
    });
  };

  return (
    <div className={`about-content ${className}`} style={containerStyle}>
      {/* Short Description */}
      {content.shortDescription && (
        <Paragraph style={{ ...paragraphStyle, fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }}>
          {content.shortDescription}
        </Paragraph>
      )}

      {/* Detailed Content */}
      {content.detailedContent && renderDetailedContent(content.detailedContent)}
    </div>
  );
});

AboutContent.displayName = 'AboutContent';

export default AboutContent;
