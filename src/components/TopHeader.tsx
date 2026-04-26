import { Search, Globe, ChevronDown, ChevronRight, Moon, Sun, LogOut, Loader2, User, Building2, Briefcase, FileText, Users, UserCircle, FileCheck, Layers, MapPin, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/slices/authSlice";
import api from '@/lib/api';

const TYPE_ICONS: Record<string, any> = {
  user: User,
  project: Briefcase,
  template: FileText,
  salesman: UserCircle,
  client: Users,
  apartment: Building2,
  legality: FileCheck,
  material: Layers,
  contract: FileCheck,
  city: MapPin,
  country: Globe,
  bank: Building
};

const TYPE_ROUTES: Record<string, string> = {
  user: '/users',
  project: '/projects',
  template: '/templates',
  salesman: '/salesman',
  client: '/clients',
  apartment: '/apartments',
  legality: '/legality',
  material: '/materials',
  contract: '/contracts',
  city: '/cities',
  country: '/countries',
  bank: '/banks',
  'finance-dashboard': '/finance-dashboard',
  'resources-dashboard': '/dashboard'
};

export function TopHeader() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const [currentLocation] = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const getPageTitle = () => {
    const path = currentLocation.split('/')[1];
    if (!path) return t('topHeader.overview');
    
    const fallbackTitle = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const titles: Record<string, string> = {
      'dashboard': t('sidebar.dashboard', 'Dashboard'),
      'projects': t('sidebar.projects', 'Projects'),
      'legality': t('sidebar.legality', 'Legality'),
      'templates': t('sidebar.templates', 'Templates'),
      'apartments': t('sidebar.apartments', 'Apartments'),
      'clients': t('sidebar.clients', 'Clients'),
      'sales-team': t('sidebar.salesTeam', 'Sales Team'),
      'contracts': t('sidebar.contracts', 'Contracts'),
      'finance-dashboard': t('sidebar.finance', 'Finance'),
      'roles': t('sidebar.roles', 'Roles'),
      'users': t('sidebar.users', 'Users'),
      'materials': t('sidebar.materials', 'Purchases'),
      'countries': t('sidebar.countries', 'Countries'),
      'cities': t('sidebar.cities', 'Cities'),
      'banks': t('sidebar.banks', 'Banks'),
    };

    return titles[path] || fallbackTitle;
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const response = await api.get(`/statics/search?search=${searchQuery}`);
          setSearchResults(response.data.data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (result: any) => {
    const basePath = TYPE_ROUTES[result.type] || '/dashboard';
    const path = (result.type === 'user' || result.type === 'contract') ? basePath : `${basePath}/${result.id}`;
    setLocation(path);
    setShowResults(false);
    setSearchQuery('');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setLocation('/');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cairo:wght@400;600;700&display=swap');

        .top-header * { box-sizing: border-box; }

        .top-header {
          font-family: 'Inter', 'Cairo', sans-serif;
        }

        .th-search-input {
          width: 100%;
          height: 38px;
          padding: 0 38px 0 36px;
          background: transparent;
          border: 1px solid var(--th-border);
          border-radius: 10px;
          font-family: 'Inter', 'Cairo', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          color: var(--th-text-primary);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          caret-color: var(--th-accent);
        }
        .th-search-input::placeholder { color: var(--th-text-muted); }
        .th-search-input:focus {
          border-color: var(--th-accent-faint);
          box-shadow: 0 0 0 3px var(--th-accent-glow);
        }

        .th-search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: var(--th-dropdown-bg);
          border: 1px solid var(--th-border-strong);
          border-radius: 12px;
          box-shadow: 0 10px 40px var(--th-shadow-strong);
          z-index: 100;
          max-height: 400px;
          overflow-y: auto;
          padding: 6px;
        }

        .th-search-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .th-search-item:hover {
          background: var(--th-bg-hover);
        }

        .th-search-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--th-accent-bg);
          color: var(--th-accent);
          flex-shrink: 0;
        }

        .th-search-item-info {
          flex: 1;
          min-width: 0;
        }

        .th-search-item-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--th-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .th-search-item-type {
          font-size: 11px;
          color: var(--th-text-muted);
          text-transform: capitalize;
        }

        .th-icon-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 9px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--th-text-muted);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          position: relative;
          flex-shrink: 0;
        }
        .th-icon-btn:hover {
          background: var(--th-bg-hover);
          border-color: var(--th-border);
          color: var(--th-text-primary);
        }

        .th-ai-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0 14px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid var(--th-accent-border);
          background: var(--th-accent-bg);
          color: var(--th-accent);
          font-family: 'Inter', 'Cairo', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .th-ai-btn:hover {
          background: var(--th-accent-bg-hover);
          box-shadow: 0 2px 12px var(--th-accent-shadow);
          transform: translateY(-0.5px);
        }
        .th-ai-btn:active { transform: translateY(0); }

        .th-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--th-dropdown-bg);
          border: 1px solid var(--th-border-strong);
          border-radius: 14px;
          box-shadow: 0 8px 40px var(--th-shadow-strong), 0 1px 0 var(--th-border) inset;
          z-index: 100;
          overflow: hidden;
          animation: th-drop-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes th-drop-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .th-menu-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 400;
          color: var(--th-text-secondary);
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .th-menu-item:hover {
          background: var(--th-bg-hover);
          color: var(--th-text-primary);
        }
        .th-menu-item.danger { color: #ef4444; }
        .th-menu-item.danger:hover { background: rgba(239,68,68,0.07); color: #dc2626; }

        .th-notif-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #ef4444;
          flex-shrink: 0;
        }
        .th-notif-dot.read { background: var(--th-border-strong); }

        /* Theme tokens */
        :root {
          --th-bg: #ffffff;
          --th-bg-hover: rgba(0,0,0,0.04);
          --th-border: rgba(0,0,0,0.08);
          --th-border-strong: rgba(0,0,0,0.12);
          --th-text-primary: #111111;
          --th-text-secondary: #555555;
          --th-text-muted: #999999;
          --th-accent: #7C3D1F;
          --th-accent-faint: rgba(124,61,31,0.4);
          --th-accent-glow: rgba(124,61,31,0.08);
          --th-accent-bg: rgba(124,61,31,0.06);
          --th-accent-bg-hover: rgba(124,61,31,0.1);
          --th-accent-border: rgba(124,61,31,0.2);
          --th-accent-shadow: rgba(124,61,31,0.15);
          --th-dropdown-bg: #ffffff;
          --th-shadow-strong: rgba(0,0,0,0.12);
          --th-divider: rgba(0,0,0,0.06);
        }
        .dark {
          --th-bg: #0f0f0f;
          --th-bg-hover: rgba(255,255,255,0.05);
          --th-border: rgba(255,255,255,0.08);
          --th-border-strong: rgba(255,255,255,0.12);
          --th-text-primary: #f0ebe4;
          --th-text-secondary: #a09080;
          --th-text-muted: #5a5248;
          --th-accent: #D4A574;
          --th-accent-faint: rgba(212,165,116,0.4);
          --th-accent-glow: rgba(212,165,116,0.08);
          --th-accent-bg: rgba(212,165,116,0.07);
          --th-accent-bg-hover: rgba(212,165,116,0.12);
          --th-accent-border: rgba(212,165,116,0.2);
          --th-accent-shadow: rgba(212,165,116,0.18);
          --th-dropdown-bg: #1a1714;
          --th-shadow-strong: rgba(0,0,0,0.5);
          --th-divider: rgba(255,255,255,0.05);
        }
      `}</style>

      <header
        className="top-header"
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "var(--th-bg)",
          borderBottom: "1px solid var(--th-border)",
          gap: "16px",
        }}
      >
        {/* LEFT ── Breadcrumb + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, minWidth: 0 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <span style={{ fontSize: "13px", color: "var(--th-text-muted)", fontWeight: 400 }}>
              {t('sidebar.dashboard')}
            </span>
            <ChevronRight style={{ width: 13, height: 13, color: "var(--th-text-muted)", opacity: 0.5 }} />
            <span style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--th-text-primary)",
              fontFamily: "'Inter', sans-serif",
              fontStyle: "italic",
            }}>
              {getPageTitle()}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "18px", background: "var(--th-divider)", flexShrink: 0 }} />

          {/* Search */}
          <div ref={searchRef} style={{ position: "relative", maxWidth: "450px", flex: 1 }}>
            <Search style={{
              position: "absolute", [i18n.language === 'ar' ? 'right' : 'left']: 11, top: "50%", transform: "translateY(-50%)",
              width: 14, height: 14,
              color: searchFocused ? "var(--th-accent)" : "var(--th-text-muted)",
              transition: "color 0.15s",
              pointerEvents: "none",
            } as any} />
            <input
              className="th-search-input"
              type="text"
              placeholder={t('topHeader.searchPlaceholder') || "Search…"}
              style={{
                 paddingLeft: i18n.language === 'ar' ? '10px' : '36px',
                 paddingRight: i18n.language === 'ar' ? '36px' : '10px',
                 textAlign: i18n.language === 'ar' ? 'right' : 'left'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                if (searchResults.length > 0) setShowResults(true);
              }}
              onBlur={() => setSearchFocused(false)}
            />
            {isSearching && (
              <Loader2 className="animate-spin" style={{
                position: "absolute", [i18n.language === 'ar' ? 'left' : 'right']: 40, top: "50%", transform: "translateY(-50%)",
                width: 14, height: 14,
                color: "var(--th-accent)",
              } as any} />
            )}
            <kbd style={{
              position: "absolute", [i18n.language === 'ar' ? 'left' : 'right']: 10, top: "50%", transform: "translateY(-50%)",
              display: "flex", alignItems: "center",
              padding: "2px 5px",
              fontSize: "10px",
              color: "var(--th-text-muted)",
              background: "var(--th-bg-hover)",
              border: "1px solid var(--th-border)",
              borderRadius: "5px",
              fontFamily: "inherit",
              opacity: searchFocused || searchQuery ? 0 : 1,
              transition: "opacity 0.15s",
              pointerEvents: "none",
              letterSpacing: "0.01em",
            } as any}>⌘K</kbd>

            {/* Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="th-search-dropdown">
                {searchResults.map((result, idx) => {
                  const Icon = TYPE_ICONS[result.type] || Search;
                  const name = typeof result.name === 'object' 
                    ? (i18n.language === 'ar' ? result.name.arabic : result.name.english)
                    : result.name;
                  
                  return (
                    <div 
                      key={`${result.type}-${result.id}-${idx}`}
                      className="th-search-item"
                      onClick={() => handleResultClick(result)}
                      style={{ flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row' } as any}
                    >
                      <div className="th-search-item-icon">
                        {result.image ? (
                           <img src={`${api.defaults.baseURL?.replace('/api', '')}/${result.image}`} alt="" className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <Icon size={16} />
                        )}
                      </div>
                      <div className="th-search-item-info" style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                        <div className="th-search-item-name">{name}</div>
                        <div className="th-search-item-type">{t(`sidebar.${result.type}`, { defaultValue: result.type }) as string}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="th-search-dropdown" style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--th-text-muted)' }}>
                {t('common.noResults', 'No results found')}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ── Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "var(--th-divider)", margin: "0 6px" }} />

          {/* Language */}
          <button className="th-icon-btn" onClick={toggleLanguage} title="Toggle language">
            <Globe style={{ width: 15, height: 15 }} />
          </button>

          {/* Theme */}
          <button className="th-icon-btn" onClick={toggleTheme} title="Toggle theme">
            {mounted && (theme === 'dark'
              ? <Sun style={{ width: 15, height: 15 }} />
              : <Moon style={{ width: 15, height: 15 }} />
            )}
          </button>

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "var(--th-divider)", margin: "0 6px" }} />

          {/* Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => { setProfileOpen(v => !v); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "10px",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--th-bg-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <Avatar style={{
                  width: 32, height: 32,
                  border: "1.5px solid var(--th-accent-faint)",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback style={{
                    background: "var(--th-accent-bg)",
                    color: "var(--th-accent)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}>{user?.email?.substring(0, 2).toUpperCase() || 'AZ'}</AvatarFallback>
                </Avatar>
                <span style={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "2px solid var(--th-bg)",
                }} />
              </div>

              {/* User Info */}
              <div style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "var(--th-text-primary)", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                  {user?.email || t('topHeader.userName')}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--th-text-muted)", lineHeight: 1.3 }}>
                  {user?.role?.name || t('topHeader.userRole')}
                </p>
              </div>

              <ChevronDown style={{
                width: 13, height: 13,
                color: "var(--th-text-muted)",
                transition: "transform 0.18s",
                transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                flexShrink: 0,
              }} />
            </button>

            {profileOpen && (
              <div className="th-dropdown" style={{ 
                width: 240, 
                right: 0 
              } as any}>
                {/* User card */}
                <div style={{
                  padding: "16px",
                  borderBottom: "1px solid var(--th-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
                  background: 'var(--th-bg-hover)',
                } as any}>
                  <Avatar style={{ width: 42, height: 42, border: "1.5px solid var(--th-accent-faint)", borderRadius: "50%", flexShrink: 0 }}>
                    <AvatarImage src={user?.image} />
                    <AvatarFallback style={{ background: "var(--th-accent-bg)", color: "var(--th-accent)", fontSize: "14px", fontWeight: 600 }}>{user?.email?.substring(0, 2).toUpperCase() || 'AZ'}</AvatarFallback>
                  </Avatar>
                  <div style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left', flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "14px", 
                      fontWeight: 600, 
                      color: "var(--th-text-primary)", 
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {user?.email || t('topHeader.userName')}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--th-text-muted)", fontWeight: 500 }}>
                      {user?.role?.name || t('topHeader.userRole')}
                    </p>
                  </div>
                </div>

                <div style={{ padding: "8px" }}>
                  <div 
                    className="th-menu-item danger" 
                    style={{ 
                      borderRadius: 10,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
                      justifyContent: 'start',
                      fontWeight: 500
                    } as any} 
                    onClick={handleSignOut}
                  >
                    <LogOut style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>{t('topHeader.signOut')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}