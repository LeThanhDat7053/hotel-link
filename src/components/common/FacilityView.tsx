import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FacilityList } from './FacilityList';
import { FacilityDetail } from './FacilityDetail';
import { useFacilityDetail } from '../../hooks/useFacility';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { extractCleanPath, getLocalizedPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { FacilityUIData } from '../../types/facility';

interface FacilityViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void; // Callback để thông báo vr_link cho parent
}

export const FacilityView: FC<FacilityViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange 
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Fetch facility detail when selected
  const { facility, loading, error } = useFacilityDetail({
    propertyId,
    facilityId: selectedFacilityId,
    locale,
    enabled: selectedFacilityId !== null,
  });

  const handleFacilityClick = useCallback((facility: FacilityUIData) => {
    setSelectedFacilityId(facility.id);
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(`${cleanPath}/${facility.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(facility.name);
    onVrLinkChange?.(facility.vrLink);
  }, [onTitleChange, onVrLinkChange, navigate, location.pathname, locale]);

  const handleBack = useCallback(() => {
    setSelectedFacilityId(null);
    const cleanPath = '/tien-ich';
    const newPath = getLocalizedPath(cleanPath, locale);
    navigate(newPath, { replace: true });
    const t = getMenuTranslations(locale);
    onTitleChange?.(t.facilities);
    onVrLinkChange?.(null);
  }, [onTitleChange, onVrLinkChange, navigate, locale]);

  // Update title when facility data changes
  useEffect(() => {
    if (facility && selectedFacilityId) {
      onTitleChange?.(facility.name);
    }
  }, [facility, selectedFacilityId, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (!selectedFacilityId) {
      const t = getMenuTranslations(locale);
      onTitleChange?.(t.facilities);
    }
  }, [selectedFacilityId, locale, onTitleChange]);

  // Sync URL code with selectedFacilityId
  useEffect(() => {
    if (code && !selectedFacilityId) {
      setSelectedFacilityId(-1);
    }
  }, [code, selectedFacilityId]);

  // Show detail view when facility is selected or code in URL
  if ((selectedFacilityId !== null && selectedFacilityId > 0) || code) {
    return (
      <FacilityDetail 
        facility={facility} 
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
    <FacilityList 
      onFacilityClick={handleFacilityClick}
      className={className}
    />
  );
});

FacilityView.displayName = 'FacilityView';
