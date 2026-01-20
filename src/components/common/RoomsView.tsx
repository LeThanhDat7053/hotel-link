import type { FC } from 'react';
import { memo, useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RoomList } from './RoomList';
import { RoomDetail } from './RoomDetail';
import { useRoomDetail } from '../../hooks/useRooms';
import { useProperty } from '../../context/PropertyContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedPath, extractCleanPath } from '../../constants/routes';
import { getMenuTranslations } from '../../constants/translations';
import type { RoomUIData } from '../../types/room';

interface RoomsViewProps {
  className?: string;
  onTitleChange?: (title: string) => void;
  onVrLinkChange?: (vrLink: string | null) => void;
}

export const RoomsView: FC<RoomsViewProps> = memo(({ 
  className = '',
  onTitleChange,
  onVrLinkChange
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useProperty();
  const { locale } = useLanguage();

  // Fetch room detail when selected
  const { room, loading, error } = useRoomDetail({
    propertyId,
    roomId: selectedRoomId,
    locale,
    enabled: selectedRoomId !== null,
  });

  const handleRoomClick = useCallback((room: RoomUIData) => {
    setSelectedRoomId(room.id);
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(`${cleanPath}/${room.code}`, locale);
    navigate(newPath, { replace: true });
    onTitleChange?.(room.name);
  }, [onTitleChange, navigate, location.pathname, locale]);

  const handleBack = useCallback(() => {
    setSelectedRoomId(null);
    const cleanPath = '/phong-nghi';
    const newPath = getLocalizedPath(cleanPath, locale);
    navigate(newPath, { replace: true });
    const t = getMenuTranslations(locale);
    onTitleChange?.(t.rooms);
  }, [onTitleChange, navigate, locale]);

  // Update title when room data changes
  useEffect(() => {
    if (room && selectedRoomId) {
      onTitleChange?.(room.name);
    }
  }, [room, selectedRoomId, onTitleChange]);

  // Set title to list page title when not viewing detail
  useEffect(() => {
    if (!selectedRoomId) {
      const t = getMenuTranslations(locale);
      onTitleChange?.(t.rooms);
    }
  }, [selectedRoomId, locale, onTitleChange]);

  // Sync URL code with selectedRoomId
  useEffect(() => {
    if (code && !selectedRoomId) {
      // Code in URL but no selectedRoomId - this happens on page load
      // RoomList will handle room click based on code
      setSelectedRoomId(-1); // Temporary flag to show room is being loaded
    }
  }, [code, selectedRoomId]);

  // Show detail view when room is selected or code in URL
  if ((selectedRoomId !== null && selectedRoomId > 0) || code) {
    return (
      <RoomDetail 
        room={room} 
        loading={loading}
        error={error}
        onBack={handleBack}
        onVrLinkChange={onVrLinkChange}
        className={className}
        roomCode={code}
      />
    );
  }

  // Show list view
  return (
    <RoomList 
      onRoomClick={handleRoomClick}
      className={className}
    />
  );
});

RoomsView.displayName = 'RoomsView';
