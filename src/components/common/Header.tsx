import type { FC, CSSProperties } from 'react';
import { memo, useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  DownOutlined,
  CloseOutlined,
  MenuOutlined,
  HomeOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  InstagramOutlined
} from '@ant-design/icons';
import { Dropdown, Button, Space, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { useLanguage, type Language } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getMenuTranslations } from '../../constants/translations';
import { useContact } from '../../hooks/useContact';
import { usePropertyContext } from '../../context/PropertyContext';
import { useVrHotelSettings } from '../../hooks/useVR360';
import { getLocalizedPath, extractCleanPath } from '../../constants/routes';

const { useBreakpoint } = Grid;

interface HeaderProps {
  className?: string;
  isMenuExpanded?: boolean;
  onMenuToggle?: (expanded: boolean) => void;
}

interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

export const Header: FC<HeaderProps> = memo(({ isMenuExpanded = false, onMenuToggle }) => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { currentLang, availableLocales, setLanguage, locale } = useLanguage();
  const { primaryColor } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { property } = usePropertyContext();
  const { content: contactData } = useContact(property?.id || 0, locale);
  const { settings: vrHotelSettings, loading: vrSettingsLoading } = useVrHotelSettings(property?.id || null);

  // Auto-open menu sau khi settings load xong + delay để smooth
  useEffect(() => {
    if (!vrSettingsLoading && vrHotelSettings) {
      // Delay 500ms sau khi settings load xong rồi mở menu
      const timer = setTimeout(() => {
        onMenuToggle?.(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [vrSettingsLoading, vrHotelSettings, onMenuToggle]);

  // Lấy translations theo locale hiện tại
  const t = useMemo(() => getMenuTranslations(locale), [locale]);

  // Mapping giữa menu path và API page key
  const pageKeyMap: Record<string, string> = {
    '/phong-nghi': 'rooms',
    '/am-thuc': 'dining',
    '/tien-ich': 'facilities',
    '/dich-vu': 'services',
    '/uu-dai': 'offers',
  };

  // Menu items với translations động theo locale
  const menuItems: MenuItem[] = useMemo(() => {
    const allItems = [
      { path: '/gioi-thieu', label: t.about },
      { path: '/phong-nghi', label: t.rooms },
      { path: '/am-thuc', label: t.dining },
      { path: '/tien-ich', label: t.facilities },
      { path: '/dich-vu', label: t.services },
      { path: '/chinh-sach', label: t.policy },
      { path: '/lien-he', label: t.contact },
    ];

    // Filter menu items dựa trên is_displaying từ VR Hotel Settings
    if (!vrHotelSettings?.pages) {
      return allItems;
    }

    return allItems.filter((item) => {
      const pageKey = pageKeyMap[item.path];
      // Nếu không có trong map (ví dụ: gioi-thieu, chinh-sach, lien-he) thì hiển thị
      if (!pageKey) {
        return true;
      }
      // Kiểm tra is_displaying từ API
      const pageSettings = vrHotelSettings.pages[pageKey as keyof typeof vrHotelSettings.pages];
      return pageSettings?.is_displaying !== false;
    });
  }, [t, vrHotelSettings]);

  // Footer links với translations động theo locale (có thể dùng sau)
  // const footerLinks = useMemo(() => [
  //   { path: '/thu-vien-anh', label: t.gallery },
  //   { path: '/noi-quy-khach-san', label: t.regulation },
  //   { path: '/tin-tuc-su-kien', label: t.news },
  // ], [t]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Navigate to same page but with new language
    const cleanPath = extractCleanPath(location.pathname);
    const newPath = getLocalizedPath(cleanPath, lang.code);
    navigate(newPath, { replace: true });
  };

  const toggleSubMenu = (path: string) => {
    setOpenSubMenu(openSubMenu === path ? null : path);
  };

  // Language dropdown menu items from API (no flags, only native_name)
  const languageMenuItems: MenuProps['items'] = availableLocales
    .filter(l => l.code !== currentLang.code)
    .map(lang => ({
      key: lang.code,
      label: (
        <span style={{ fontSize: 11, letterSpacing: 0.5, padding: '0 8px' }}>{lang.name}</span>
      ),
      onClick: () => handleLanguageChange(lang),
    }));

  // Style constants
  const headerStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 60,
    pointerEvents: 'none',
  };

  const menuBgStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 60,
    width: screens.md ? 280 : screens.sm ? 260 : 240,
    maxWidth: screens.md ? 280 : screens.sm ? 260 : 240,
    background: '#000000ad',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    borderBottomLeftRadius: 22,
    pointerEvents: 'auto',
  };

  const menuTopBarStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: 62,
  };

  const langMenuBgStyle: CSSProperties = {
    position: 'absolute',
    left: 16,
    top: 12,
    width: 138,
    height: 37,
    background: 'rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    border: `1px solid ${primaryColor}99`,
    borderRadius: 12,
    zIndex: 10,
  };

  const langButtonStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    background: 'transparent',
    border: 'none',
    borderRadius: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    padding: '0 12px',
    fontSize: 11,
    letterSpacing: 0.5,
  };

  const toggleBtnStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 62,
    height: 62,
    overflow: 'hidden',
    background: 'var(--primary-color, #ecc56d)', // Dùng CSS variable để tránh flash
    border: 'none',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    transition: 'background 300ms linear',
    zIndex: 10,
  };

  const menuContentStyle: CSSProperties = {
    transformOrigin: 'top center',
    transition: 'all 300ms linear',
    transform: isMenuExpanded ? 'scaleY(1)' : 'scaleY(0)',
    opacity: isMenuExpanded ? 1 : 0,
    maxHeight: isMenuExpanded ? 'none' : 0,
  };

  const socialBtnStyle: CSSProperties = {
    display: 'inline-block',
    width: 32,
    height: 32,
    textAlign: 'center',
    borderRadius: 8,
    lineHeight: '32px',
    margin: '0 7px',
    transition: 'all 200ms linear',
    color: 'white',
    textDecoration: 'none',
  };

  // Home button style - Góc trái trên
  const homeBtnStyle: CSSProperties = {
    position: 'fixed',
    top: screens.md ? 12 : 10,
    left: screens.md ? 15 : 10,
    width: screens.md ? 50 : 44,
    height: screens.md ? 50 : 44,
    background: 'rgba(0, 0, 0, 0.68)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'all 300ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 61,
    pointerEvents: 'auto',
  };

  return (
    <header style={headerStyle}>
      {/* Home Button - Góc trái trên */}
      <Link
        to={getLocalizedPath('/', locale)}
        style={homeBtnStyle}
        onMouseEnter={(e) => {
          const icon = e.currentTarget.querySelector('.home-icon') as HTMLElement;
          if (icon) icon.style.color = primaryColor;
        }}
        onMouseLeave={(e) => {
          const icon = e.currentTarget.querySelector('.home-icon') as HTMLElement;
          if (icon) icon.style.color = '#fff';
        }}
        title="Trang chủ"
      >
        <HomeOutlined className="home-icon" style={{ fontSize: screens.md ? 22 : 20, color: '#fff', transition: 'color 200ms ease' }} />
      </Link>

      <style>{`
        /* Primary Menu Items CSS */
        .primary-menu {
          float: left;
          width: 100%;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .primary-menu .menu-item a {
          position: relative;
          display: block;
          width: 100%;
          height: 48px;
          line-height: 48px;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          text-transform: uppercase;
          font-weight: 100;
          font-size: 13px;
          letter-spacing: 2px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 300ms linear;
          text-decoration: none;
          background: transparent;
        }

        .primary-menu .menu-item a:hover {
          color: ${primaryColor};
        }

        .primary-menu .menu-item a::before {
          position: absolute;
          content: "";
          bottom: 0;
          right: 0;
          width: 100%;
          max-width: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 300ms linear;
        }

        .primary-menu .menu-item a:hover::before {
          max-width: 100%;
          right: auto;
          left: 0;
        }

        .primary-menu .menu-item a.active {
          color: ${primaryColor};
        }

        /* Menu item có submenu */
        .primary-menu .menu-item.has-submenu > div {
          position: relative;
          display: block;
          width: 100%;
          height: 48px;
          line-height: 48px;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          text-transform: uppercase;
          font-weight: 100;
          font-size: 13px;
          letter-spacing: 2px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 300ms linear;
          cursor: pointer;
        }

        .primary-menu .menu-item.has-submenu > div:hover {
          color: ${primaryColor};
        }

        /* Submenu CSS */
        .sub-menu {
          list-style: none;
          margin: 0;
          padding: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .sub-menu .menu-item a {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          letter-spacing: 1.5px;
          padding-left: 20px;
          text-align: left;
          color: rgba(255, 255, 255, 0.7);
        }

        .sub-menu .menu-item a:hover {
          color: #fff;
          background: rgba(212, 168, 85, 0.1);
        }

        ::-webkit-scrollbar {
          width: 2px;
        } 
        
        ::-webkit-scrollbar-thumb {
          background: ${primaryColor}80;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }

        .lang-dropdown-custom .ant-dropdown-menu {
          background: #000000ad !important;
          backdrop-filter: blur(2px);
          border: 1px solid ${primaryColor}4D !important;
          borderRadius: 12px !important;
          padding: 8px 0 !important;
          marginTop: 8px !important;
        }

        .lang-dropdown-custom .ant-dropdown-menu-item {
          color: rgba(255, 255, 255, 0.8) !important;
          padding: 10px 16px !important;
          border-bottom: 1px solid ${primaryColor}26;
          borderRadius: 0 !important;
        }

        .lang-dropdown-custom .ant-dropdown-menu-item:last-child {
          border-bottom: none;
        }

        .lang-dropdown-custom .ant-dropdown-menu-item:hover {
          background: ${primaryColor}26 !important;
          color: ${primaryColor} !important;
        }
      `}</style>

      {/* Main Menu Panel - LUÔN Ở BÊN PHẢI */}
      <div style={menuBgStyle}>
        <div style={{ width: '100%', position: 'relative' }}>
          {/* Top Bar: Language Selector | Toggle Button */}
          <div style={menuTopBarStyle}>
            {/* Language Selector với Ant Design Dropdown */}
            <div style={langMenuBgStyle}>
              <Dropdown
                menu={{ items: languageMenuItems }}
                trigger={['hover']}
                placement="bottomLeft"
                classNames={{ root: 'lang-dropdown-custom' }}
              >
                <Button style={langButtonStyle}>
                  <Space size={4}>
                    <span style={{ fontWeight: 500 }}>{currentLang.name}</span>
                    <DownOutlined style={{ fontSize: 9 }} />
                  </Space>
                </Button>
              </Dropdown>
            </div>

            {/* Toggle Button - Hamburger hoặc X */}
            <Button
              onClick={() => onMenuToggle?.(!isMenuExpanded)}
              style={toggleBtnStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = `var(--primary-color, #ecc56d)dd`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-color, #ecc56d)'}
              icon={
                isMenuExpanded ? (
                  <CloseOutlined style={{ fontSize: 20, color: '#fff' }} />
                ) : (
                  <MenuOutlined style={{ fontSize: 20, color: '#fff' }} />
                )
              }
            />
          </div>

          {/* Menu Content - CHỈ PHẦN NÀY MỚI EXPAND/COLLAPSE */}
          <div style={menuContentStyle}>
            <nav style={{ overflow: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
              <ul className="primary-menu">
                {menuItems.map((item) => (
                  <li key={item.path} className={`menu-item ${item.children ? 'has-submenu' : ''}`}>
                    {item.children ? (
                      <>
                        <div
                          onClick={() => toggleSubMenu(item.path)}
                        >
                          <span>{item.label}</span>
                          <DownOutlined 
                            style={{ 
                              fontSize: '10px', 
                              marginLeft: '8px',
                              transition: 'transform 300ms',
                              transform: openSubMenu === item.path ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </div>
                        {/* Submenu */}
                        <ul 
                          className="sub-menu" 
                          style={{
                            maxHeight: openSubMenu === item.path ? '300px' : '0',
                            overflow: 'hidden',
                            transition: 'all 300ms linear'
                          }}
                        >
                          {item.children.map((child) => (
                            <li key={child.path} className="menu-item">
                              <Link
                                to={getLocalizedPath(child.path, locale)}
                                className={isActive(child.path) ? 'active' : ''}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        to={getLocalizedPath(item.path, locale)}
                        className={isActive(item.path) ? 'active' : ''}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Book Now Button - Ant Design */}
            <Button
              type="primary"
              size="large"
              block
              style={{
                height: 52,
                background: '#d4a855',
                color: 'white',
                textAlign: 'center',
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '0.15em',
                borderRadius: 0,
                border: 0,
                marginTop: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c49a4a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#d4a855'}
            >
              <Link to={getLocalizedPath('/dat-phong', locale)} style={{ color: 'white', textDecoration: 'none' }}>
                {t.booking}
              </Link>
            </Button>

            {/* Social Bar - Ant Design Space */}
            <Space 
              size={14} 
              style={{ width: '100%', justifyContent: 'center', margin: '38px 0' }}
              wrap
            >
              {contactData?.socialMedia?.facebook && (
                <a
                  href={contactData.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialBtnStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  title="Facebook"
                >
                  <svg viewBox="0 0 320 512" style={{ width: 18, height: 18, fill: 'currentColor' }}>
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                  </svg>
                </a>
              )}
              {contactData?.socialMedia?.instagram && (
                <a
                  href={contactData.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialBtnStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  title="Instagram"
                >
                  <InstagramOutlined style={{ fontSize: 18 }} />
                </a>
              )}
              {contactData?.socialMedia?.twitter && (
                <a
                  href={contactData.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialBtnStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  title="Twitter"
                >
                  <TwitterOutlined style={{ fontSize: 18 }} />
                </a>
              )}
              {contactData?.socialMedia?.youtube && (
                <a
                  href={contactData.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialBtnStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  title="YouTube"
                >
                  <YoutubeOutlined style={{ fontSize: 18 }} />
                </a>
              )}
            </Space>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
