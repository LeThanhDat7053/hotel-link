import type { FC } from 'react';
import { useState, useCallback, useMemo, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout, Grid, Skeleton } from 'antd';
import { ROUTES, extractCleanPath } from './constants/routes';
import { Header, InfoBox, BottomBar, RoomsView, DiningView, FacilityView, ServiceView, PolicyContent, ContactContent, GalleryContent, RegulationContent, AboutContent, PropertyPostsContent, SEOMeta } from './components/common';
import { OfferView } from './components/common/OfferView';
import { PropertyProvider, usePropertyData, LanguageProvider, usePropertyContext, ThemeProvider } from './context';
import { ThemeInjector } from './components/ThemeInjector';
import { useIntroductionContent, usePropertyPosts, usePolicy, useRegulation, useContact } from './hooks';
import { useVrHotelSettings } from './hooks/useVR360';
import { useLocale } from './context/LanguageContext';
import { getMediaType } from './utils/mediaHelper';
import { getMenuTranslations } from './constants/translations';

// Lazy load pages để tối ưu performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const APITestPage = lazy(() => import('./pages/APITestPage'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));

const { Content } = Layout;
const { useBreakpoint } = Grid;

// Layout wrapper component
const AppLayout: FC = () => {
  const location = useLocation();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [roomTitle, setRoomTitle] = useState<string | null>(null);
  const [diningTitle, setDiningTitle] = useState<string | null>(null);
  const [facilityTitle, setFacilityTitle] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState<string | null>(null);
  
  // State cho VR360 links của detail views
  const [roomDetailVrLink, setRoomDetailVrLink] = useState<string | null>(null);
  const [diningDetailVrLink, setDiningDetailVrLink] = useState<string | null>(null);
  const [facilityDetailVrLink, setFacilityDetailVrLink] = useState<string | null>(null);
  const [serviceDetailVrLink, setServiceDetailVrLink] = useState<string | null>(null);
  const [offerDetailVrLink, setOfferDetailVrLink] = useState<string | null>(null);
  const [offerTitle, setOfferTitle] = useState<string | null>(null);
  
  const screens = useBreakpoint();
  
  // Lấy dữ liệu property và locale
  const { vr360Url: defaultVr360Url, propertyName, loading, propertyId } = usePropertyData();
  const locale = useLocale();
  
  // Get translations for current locale
  const t = getMenuTranslations(locale);
  
  // Extract clean path from location (remove language prefix)
  const getCleanPath = useMemo(() => {
    return extractCleanPath(location.pathname);
  }, [location.pathname]);
  
  // Fetch property posts cho trang chủ để lấy title
  const { getFirstPostTitle } = usePropertyPosts(propertyId);
  
  // Fetch introduction data cho trang giới thiệu
  const { content: introContent, vr360Link: introVr360Link } = useIntroductionContent(propertyId, locale);
  
  // Fetch VR hotel settings cho trang phòng nghỉ
  const { settings: vrHotelSettings } = useVrHotelSettings(propertyId);
  
  // Fetch policy VR360 link cho trang chính sách
  const { vr360Link: policyVr360Link } = usePolicy(propertyId || 0, locale);
  
  // Fetch regulation data cho trang nội quy
  const { content: regulationContent, vr360Link: regulationVr360Link, loading: regulationLoading, error: regulationError } = useRegulation(propertyId || 0, locale);
  
  // Fetch contact data cho trang liên hệ
  const { content: contactContent, vr360Link: contactVr360Link, loading: contactLoading, error: contactError } = useContact(propertyId || 0, locale);
  
  // Auto expand menu when location changes
  useEffect(() => {
    // Khi chuyển trang, tự động mở header và nội dung
    setIsMenuExpanded(true);
  }, [location.pathname]);
  
  // Check if current page is Rooms page, Dining page, Facility page, Service page, Policy page, Contact page or Booking page
  const isHomePage = getCleanPath === '/';
  const isAboutPage = getCleanPath === '/gioi-thieu';
  const isRoomsPage = getCleanPath === '/phong-nghi' || getCleanPath.startsWith('/phong-nghi/');
  const isDiningPage = getCleanPath === '/am-thuc' || getCleanPath.startsWith('/am-thuc/');
  const isFacilityPage = getCleanPath === '/tien-ich' || getCleanPath.startsWith('/tien-ich/');
  const isServicePage = getCleanPath === '/dich-vu' || getCleanPath.startsWith('/dich-vu/');
  const isPolicyPage = getCleanPath === '/chinh-sach';
  const isContactPage = getCleanPath === '/lien-he';
  const isBookingPage = getCleanPath === '/dat-phong';
  const isGalleryPage = getCleanPath === '/thu-vien-anh';
  const isRegulationPage = getCleanPath === '/noi-quy-khach-san';
  const isOffersPage = getCleanPath === '/uu-dai' || getCleanPath.startsWith('/uu-dai/');
  
  // Redirect to external booking URL if on booking page
  useEffect(() => {
    if (isBookingPage && vrHotelSettings?.booking_url) {
      window.open(vrHotelSettings.booking_url, '_blank', 'noopener,noreferrer');
      // Navigate back to previous page or home
      window.history.back();
    }
  }, [isBookingPage, vrHotelSettings?.booking_url]);
  
  // Lấy title cho page hiện tại
  const getPageTitle = () => {
    // Trang chủ: lấy title từ post đầu tiên theo locale
    if (isHomePage) {
      return getFirstPostTitle(locale) || '';
    }
    // Trang giới thiệu: lấy title từ introduction API theo locale
    if (isAboutPage) {
      return introContent?.title || t.about;
    }
    // Trang chính sách: dùng translation từ header/footer
    if (isPolicyPage) {
      return t.policy;
    }
    // Trang nội quy: dùng translation từ header/footer
    if (isRegulationPage) {
      return t.regulation;
    }
    // Detail pages: use title from API
    if (isRoomsPage && roomTitle) return roomTitle;
    if (isDiningPage && diningTitle) return diningTitle;
    if (isFacilityPage && facilityTitle) return facilityTitle;
    if (isServicePage && serviceTitle) return serviceTitle;
    if (isOffersPage && offerTitle) return offerTitle;
    
    // List pages: use translations
    if (isRoomsPage) return t.rooms;
    if (isDiningPage) return t.dining;
    if (isFacilityPage) return t.facilities;
    if (isServicePage) return t.services;
    if (isContactPage) return t.contact;
    if (isBookingPage) return t.booking;
    if (isGalleryPage) return t.gallery;
    if (isOffersPage) return t.offers;
    
    return '';
  };
  const pageTitle = getPageTitle();
  
  // Callback để cập nhật title khi xem chi tiết phòng
  const handleRoomTitleChange = useCallback((title: string) => {
    setRoomTitle(title);
  }, []);

  // Callback để cập nhật title khi xem chi tiết nhà hàng
  const handleDiningTitleChange = useCallback((title: string) => {
    setDiningTitle(title);
  }, []);

  // Callback để cập nhật title khi xem chi tiết tiện ích
  const handleFacilityTitleChange = useCallback((title: string) => {
    setFacilityTitle(title);
  }, []);

  // Callback để cập nhật title khi xem chi tiết dịch vụ
  const handleServiceTitleChange = useCallback((title: string) => {
    setServiceTitle(title);
  }, []);
  
  // Callbacks để cập nhật VR360 link khi xem chi tiết
  const handleRoomVrLinkChange = useCallback((vrLink: string | null) => {
    setRoomDetailVrLink(vrLink);
  }, []);
  
  const handleDiningVrLinkChange = useCallback((vrLink: string | null) => {
    setDiningDetailVrLink(vrLink);
  }, []);
  
  const handleFacilityVrLinkChange = useCallback((vrLink: string | null) => {
    setFacilityDetailVrLink(vrLink);
  }, []);
  
  const handleServiceVrLinkChange = useCallback((vrLink: string | null) => {
    setServiceDetailVrLink(vrLink);
  }, []);
  
  const handleOfferVrLinkChange = useCallback((vrLink: string | null) => {
    setOfferDetailVrLink(vrLink);
  }, []);
  
  const handleOfferTitleChange = useCallback((title: string) => {
    setOfferTitle(title);
  }, []);
  
  // Xác định VR360 URL theo từng trang (ưu tiên detail link nếu có)
  let vr360Url = defaultVr360Url;
  
  if (isAboutPage && introVr360Link) {
    vr360Url = introVr360Link;
  } else if (isPolicyPage && policyVr360Link) {
    vr360Url = policyVr360Link;
  } else if (isRegulationPage && regulationVr360Link) {
    vr360Url = regulationVr360Link;
  } else if (isContactPage && contactVr360Link) {
    vr360Url = contactVr360Link;
  } else if (isRoomsPage) {
    // Ưu tiên detail link, fallback về page link
    vr360Url = roomDetailVrLink || vrHotelSettings?.pages?.rooms?.vr360_link || defaultVr360Url;
  } else if (isDiningPage) {
    vr360Url = diningDetailVrLink || vrHotelSettings?.pages?.dining?.vr360_link || defaultVr360Url;
  } else if (isServicePage) {
    vr360Url = serviceDetailVrLink || vrHotelSettings?.pages?.services?.vr360_link || defaultVr360Url;
  } else if (isFacilityPage) {
    vr360Url = facilityDetailVrLink || vrHotelSettings?.pages?.facilities?.vr360_link || defaultVr360Url;
  } else if (isOffersPage) {
    // Ưu tiên detail link từ offer, fallback về page link từ settings
    vr360Url = offerDetailVrLink || vrHotelSettings?.pages?.offers?.vr360_link || defaultVr360Url;
  }
  
  // Debug logs (commented out to reduce spam)
  // console.log('[App] Current page:', location.pathname);
  // console.log('[App] isRoomsPage:', isRoomsPage);
  // console.log('[App] vrHotelSettings:', vrHotelSettings);
  // console.log('[App] rooms vr360_link:', vrHotelSettings?.pages?.rooms?.vr360_link);
  // console.log('[App] Final vr360Url:', vr360Url);
  
  // Xác định loại media (image hay vr360)
  const mediaType = useMemo(() => getMediaType(vr360Url || ''), [vr360Url]);
  
  // Desktop: InfoBox hiện khi menu mở
  // Mobile: InfoBox hiện khi menu đóng
  // Khi menu đóng, InfoBox luôn đóng (kể cả trang chủ)
  const isDesktop = screens.md;
  const shouldShowInfoBox = isDesktop 
    ? isMenuExpanded 
    : !isMenuExpanded;

  return (
    <Layout 
      id="page" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000', 
        overflow: 'hidden', 
        position: 'relative' 
      }}
    >
      {/* Theme Injector - Apply dynamic colors */}
      <ThemeInjector />
      
      {/* SEO Meta Tags - Pure API driven, no props */}
      <SEOMeta />
      
      {/* Main Content - VR360 Tour Background */}
      <Content 
        id="primary" 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 0 
        }}
      >
        <div style={{ width: '100%', height: '100%' }}>
          {/* VR360/Image - Full Screen */}
          {loading ? (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#000'
            }}>
              <Skeleton.Node active style={{ width: 200, height: 200 }}>
                <span style={{ color: '#888' }}>Đang tải VR360...</span>
              </Skeleton.Node>
            </div>
          ) : vr360Url ? (
            mediaType === 'image' ? (
              // Nếu là ảnh, dùng img tag với object-fit cover
              <img
                key={vr360Url}
                src={vr360Url}
                alt={`${propertyName} Background`}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100vw', 
                  height: '100vh',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            ) : (
              // Nếu là VR360 hoặc unknown, dùng iframe
              <iframe
                key={vr360Url}
                src={vr360Url}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100vw', 
                  height: '100vh',
                  border: 0 
                }}
                title={`${propertyName} VR360 Tour`}
                allowFullScreen
              />
            )
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#1a1a2e',
              color: '#ECC56D',
              fontSize: 18
            }}>
              Không có VR360 tour cho property này
            </div>
          )}
        </div>
      </Content>

      {/* Header - Fixed Top Right */}
      <Header isMenuExpanded={isMenuExpanded} onMenuToggle={setIsMenuExpanded} />

      {/* InfoBox - Fixed Bottom Left */}
      {/* Desktop: Hiện khi menu mở HOẶC trang chủ | Mobile: Hiện khi menu đóng */}
      <InfoBox 
        title={pageTitle || undefined}
        isVisible={shouldShowInfoBox}
      >
        {/* Trang chủ: Hiển thị Property Posts */}
        {isHomePage && <PropertyPostsContent />}
        {/* Hiển thị AboutContent nếu đang ở trang giới thiệu */}
        {isAboutPage && <AboutContent />}
        {/* Hiển thị RoomsView nếu đang ở trang phòng nghỉ */}
        {isRoomsPage && <RoomsView onTitleChange={handleRoomTitleChange} onVrLinkChange={handleRoomVrLinkChange} />}
        {/* Hiển thị DiningView nếu đang ở trang ẩm thực */}
        {isDiningPage && <DiningView onTitleChange={handleDiningTitleChange} onVrLinkChange={handleDiningVrLinkChange} />}
        {/* Hiển thị FacilityView nếu đang ở trang tiện ích */}
        {isFacilityPage && <FacilityView onTitleChange={handleFacilityTitleChange} onVrLinkChange={handleFacilityVrLinkChange} />}
        {/* Hiển thị ServiceView nếu đang ở trang dịch vụ */}
        {isServicePage && <ServiceView onTitleChange={handleServiceTitleChange} onVrLinkChange={handleServiceVrLinkChange} />}
        {/* Hiển thị PolicyContent nếu đang ở trang chính sách */}
        {isPolicyPage && <PolicyContent />}
        {/* Hiển thị ContactContent nếu đang ở trang liên hệ */}
        {isContactPage && <ContactContent content={contactContent} loading={contactLoading} error={contactError} />}
        {/* Trang đặt phòng redirect đến booking_url - xử lý bởi useEffect */}
        {/* Hiển thị GalleryContent nếu đang ở trang thư viện ảnh */}
        {isGalleryPage && <GalleryContent />}
        {/* Hiển thị RegulationContent nếu đang ở trang nội quy */}
        {isRegulationPage && <RegulationContent content={regulationContent} loading={regulationLoading} error={regulationError} />}
        {/* Hiển thị OfferView nếu đang ở trang ưu đãi */}
        {isOffersPage && <OfferView onTitleChange={handleOfferTitleChange} onVrLinkChange={handleOfferVrLinkChange} />}
      </InfoBox>

      {/* Footer & Copyright - Fixed Bottom */}
      <BottomBar />

      {/* Hidden Routes - for navigation logic with Suspense */}
      <Suspense fallback={
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 9999
        }}>
          <Skeleton.Node active style={{ width: 200, height: 200 }}>
            <span style={{ color: '#888' }}>Đang tải...</span>
          </Skeleton.Node>
        </div>
      }>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={`/:lang${ROUTES.HOME}`} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={`/:lang${ROUTES.ABOUT}`} element={<AboutPage />} />
          <Route path="/api-test" element={<APITestPage />} />
          <Route path="/:lang/api-test" element={<APITestPage />} />
          <Route path="/gioi-thieu" element={<div />} />
          <Route path="/:lang/gioi-thieu" element={<div />} />
          <Route path="/phong-nghi" element={<RoomsPage />} />
          <Route path="/:lang/phong-nghi" element={<RoomsPage />} />
          <Route path="/phong-nghi/:code" element={<RoomsPage />} />
          <Route path="/:lang/phong-nghi/:code" element={<RoomsPage />} />
          <Route path="/dat-phong" element={<div />} />
          <Route path="/:lang/dat-phong" element={<div />} />
          <Route path="/am-thuc" element={<div />} />
          <Route path="/:lang/am-thuc" element={<div />} />
          <Route path="/am-thuc/:code" element={<div />} />
          <Route path="/:lang/am-thuc/:code" element={<div />} />
          <Route path="/tien-ich" element={<div />} />
          <Route path="/:lang/tien-ich" element={<div />} />
          <Route path="/tien-ich/:code" element={<div />} />
          <Route path="/:lang/tien-ich/:code" element={<div />} />
          <Route path="/dich-vu" element={<div />} />
          <Route path="/:lang/dich-vu" element={<div />} />
          <Route path="/dich-vu/:code" element={<div />} />
          <Route path="/:lang/dich-vu/:code" element={<div />} />
          <Route path="/lien-he" element={<div />} />
          <Route path="/:lang/lien-he" element={<div />} />
          <Route path="/chinh-sach" element={<div />} />
          <Route path="/:lang/chinh-sach" element={<div />} />
          <Route path="/thu-vien-anh" element={<div />} />
          <Route path="/:lang/thu-vien-anh" element={<div />} />
          <Route path="/noi-quy-khach-san" element={<div />} />
          <Route path="/:lang/noi-quy-khach-san" element={<div />} />
          <Route path="/uu-dai" element={<div />} />
          <Route path="/:lang/uu-dai" element={<div />} />
          <Route path="/uu-dai/:code" element={<div />} />
          <Route path="/:lang/uu-dai/:code" element={<div />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

// Wrapper component để inject propertyId vào LanguageProvider
const LanguageWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { property } = usePropertyContext();
  return (
    <LanguageProvider propertyId={property?.id || null}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
};

function App() {
  return (
    <PropertyProvider>
      <Router>
        <LanguageWrapper>
          <AppLayout />
        </LanguageWrapper>
      </Router>
    </PropertyProvider>
  );
}

export default App;
