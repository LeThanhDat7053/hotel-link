import type { FC, CSSProperties } from 'react';
import { memo } from 'react';
import { Typography, Grid, Spin, Alert } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import type { RegulationUIData } from '../../types/regulation';

const { Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface RegulationContentProps {
  className?: string;
  content: RegulationUIData | null;
  loading?: boolean;
  error?: Error | null;
}

export const RegulationContent: FC<RegulationContentProps> = memo(({ 
  className = '',
  content,
  loading = false,
  error = null
}) => {
  const screens = useBreakpoint();
  const { primaryColor } = useTheme();

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

  const regulationListStyle: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: screens.md ? 14 : 12,
    lineHeight: screens.md ? '22px' : '20px',
    textAlign: 'justify' as const,
    margin: 0,
  };

  const descriptionStyle: CSSProperties = {
    ...regulationListStyle,
    marginBottom: 16,
    fontStyle: 'italic',
  };

  const paragraphStyle: CSSProperties = {
    ...regulationListStyle,
    whiteSpace: 'pre-line' as const,
  };

  // Loading state
  if (loading) {
    return (
      <div className={`regulation-content ${className}`} style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`regulation-content ${className}`} style={{ padding: '20px' }}>
        <Alert
          title="Lỗi"
          message={error.message || 'Không thể tải nội quy khách sạn'}
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
    <div className={`regulation-content ${className}`}>
      <div className="nicescroll-bg" style={containerStyle}>
        {/* Short Description */}
        {content.shortDescription && (
          <Paragraph style={descriptionStyle}>
            {content.shortDescription}
          </Paragraph>
        )}

        {/* Detailed Content - split by paragraphs */}
        {content.detailedContent && (
          <Paragraph style={paragraphStyle}>
            {content.detailedContent}
          </Paragraph>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .regulation-content .nicescroll-bg::-webkit-scrollbar {
          width: 2px;
        }
        .regulation-content .nicescroll-bg::-webkit-scrollbar-thumb {
          background: ${primaryColor}80;
        }
        .regulation-content .nicescroll-bg::-webkit-scrollbar-track {
          background: rgba(251, 228, 150, 0);
        }
      `}</style>
    </div>
  );
});

RegulationContent.displayName = 'RegulationContent';
