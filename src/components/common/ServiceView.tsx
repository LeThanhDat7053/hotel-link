import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ServiceList } from './ServiceList';
import { ServiceDetail } from './ServiceDetail';
import { useServiceDetail } from '../../hooks/useService';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { extractCleanPath, getLocalizedPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { ServiceUIData } from '../../types/service';

interface ServiceViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void;
}

export const ServiceView: FC<ServiceViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Fetch service detail when selected
  const { service, loading, error } = useServiceDetail({
    propertyId: propertyId || 0,
    locale,
    serviceId: selectedServiceId,
  });

  const handleServiceClick = useCallback((service: ServiceUIData) => {
    setSelectedServiceId(service.id);
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(`${cleanPath}/${service.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(service.name);
    onVrLinkChange?.(service.vrLink);
  }, [onTitleChange, onVrLinkChange, navigate, location.pathname, locale]);

  const handleBack = useCallback(() => {
    setSelectedServiceId(null);
    const cleanPath = '/dich-vu';
    const newPath = getLocalizedPath(cleanPath, locale);
    navigate(newPath, { replace: true });
    const t = getMenuTranslations(locale);
    onTitleChange?.(t.services);
    onVrLinkChange?.(null);
  }, [onTitleChange, onVrLinkChange, navigate, locale]);

  // Update title when service selected
  useEffect(() => {
    if (service && selectedServiceId !== null) {
      onTitleChange?.(service.name);
    }
  }, [service, selectedServiceId, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (selectedServiceId === null) {
      const t = getMenuTranslations(locale);
      onTitleChange?.(t.services);
    }
  }, [selectedServiceId, locale, onTitleChange]);

  // Sync URL code with selectedServiceId
  useEffect(() => {
    if (code && !selectedServiceId) {
      setSelectedServiceId(-1);
    }
  }, [code, selectedServiceId]);

  // Show detail view when service is selected or code in URL
  if ((selectedServiceId !== null && selectedServiceId > 0) || code) {
    return (
      <ServiceDetail 
        service={service} 
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
    <ServiceList 
      onServiceClick={handleServiceClick}
      className={className}
    />
  );
});

ServiceView.displayName = 'ServiceView';
