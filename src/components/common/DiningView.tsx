import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DiningList } from './DiningList';
import { DiningDetail } from './DiningDetail';
import { useDiningDetail } from '../../hooks/useDining';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { extractCleanPath, getLocalizedPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { DiningUIData } from '../../types/dining';

interface DiningViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void; // Callback để thông báo vr_link cho parent
}

export const DiningView: FC<DiningViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange 
}) => {
  const [selectedDiningId, setSelectedDiningId] = useState<number | null>(null);
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Fetch dining detail when selected
  const { dining, loading, error } = useDiningDetail({
    propertyId,
    diningId: selectedDiningId,
    locale,
    enabled: selectedDiningId !== null,
  });

  const handleDiningClick = useCallback((dining: DiningUIData) => {
    setSelectedDiningId(dining.id);
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(`${cleanPath}/${dining.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(dining.name);
    onVrLinkChange?.(dining.vrLink);
  }, [onTitleChange, onVrLinkChange, navigate, location.pathname, locale]);

  const handleBack = useCallback(() => {
    setSelectedDiningId(null);
    const cleanPath = '/am-thuc';
    const newPath = getLocalizedPath(cleanPath, locale);
    navigate(newPath, { replace: true });
    const t = getMenuTranslations(locale);
    onTitleChange?.(t.dining);
    onVrLinkChange?.(null);
  }, [onTitleChange, onVrLinkChange, navigate, locale]);

  // Update title when dining data changes
  useEffect(() => {
    if (dining && selectedDiningId) {
      onTitleChange?.(dining.name);
    }
  }, [dining, selectedDiningId, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (!selectedDiningId) {
      const t = getMenuTranslations(locale);
      onTitleChange?.(t.dining);
    }
  }, [selectedDiningId, locale, onTitleChange]);

  // Sync URL code with selectedDiningId
  useEffect(() => {
    if (code && !selectedDiningId) {
      setSelectedDiningId(-1);
    }
  }, [code, selectedDiningId]);

  // Show detail view when dining is selected or code in URL
  if ((selectedDiningId !== null && selectedDiningId > 0) || code) {
    return (
      <DiningDetail 
        dining={dining} 
        loading={loading}
        error={error}
        onBack={handleBack}
        onVrLinkChange={onVrLinkChange}
        className={className}
      />
    );
  }

  // Show list view
  return (
    <DiningList 
      onDiningClick={handleDiningClick}
      className={className}
    />
  );
});

DiningView.displayName = 'DiningView';
