/**
 * PropertyPostsContent Component
 * Hiển thị property posts với locale-aware content
 */

import { Skeleton } from 'antd';
import { usePropertyPosts } from '../../hooks';
import { usePropertyData } from '../../context/PropertyContext';
import { useLocale } from '../../context/LanguageContext';
import type { PropertyPost, PostTranslation } from '../../types/api';

// Helper function to get translation by locale (không fallback)
const getPostTranslation = (post: PropertyPost, locale: string): PostTranslation | null => {
  if (!post || !post.translations || post.translations.length === 0) {
    return null;
  }

  // Chỉ tìm translation khớp CHÍNH XÁC với locale
  const translation = post.translations.find(t => t.locale === locale);
  
  return translation || null;
};

export const PropertyPostsContent = () => {
  const { propertyId } = usePropertyData();
  const locale = useLocale();
  const { posts, loading, error } = usePropertyPosts(propertyId);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (error) {
    return (
      <div style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '20px 0' }}>
        Không thể tải nội dung
      </div>
    );
  }

  // Lọc posts theo locale hiện tại - chỉ hiển thị posts có translation khớp locale
  const filteredPosts = posts.filter((post) => {
    const translation = getPostTranslation(post, locale);
    // Chỉ giữ lại posts có translation khớp CHÍNH XÁC với locale hiện tại
    return translation && translation.locale === locale;
  });

  // Empty state - để trống khi không có dữ liệu
  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {filteredPosts.map((post) => {
        const content = getPostTranslation(post, locale);
        
        if (!content) return null;

        return (
          <div key={`${post.id}-${locale}`}>
            {/* Content - HTML rendered */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                lineHeight: '22px',
              }}
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PropertyPostsContent;
