import { Search, Globe, Bell, ChevronDown, ChevronRight, Moon, Sun, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

export function TopHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  const getPageTitle = () => {
    const path = location.split('/')[1];
    if (!path) return t('topHeader.overview');
    
    // Convert path to capitalized words (e.g., 'sales-team' -> 'Sales Team')
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
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
    localStorage.removeItem('token');
    window.location.replace('/');
  };

  const notifications = [
    { id: 1, title: "New report available", desc: "Q2 performance report is ready", time: "2m ago", unread: true },
    { id: 2, title: "Meeting reminder", desc: "Team sync in 30 minutes", time: "28m ago", unread: true },
    { id: 3, title: "Task completed", desc: "Data export finished successfully", time: "1h ago", unread: false },
  ];

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
          <div style={{ position: "relative", maxWidth: "450px", flex: 1 }}>
            <Search style={{
              position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
              width: 14, height: 14,
              color: searchFocused ? "var(--th-accent)" : "var(--th-text-muted)",
              transition: "color 0.15s",
              pointerEvents: "none",
            }} />
            <input
              className="th-search-input"
              type="text"
              placeholder={t('topHeader.searchPlaceholder') || "Search…"}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              display: "flex", alignItems: "center",
              padding: "2px 5px",
              fontSize: "10px",
              color: "var(--th-text-muted)",
              background: "var(--th-bg-hover)",
              border: "1px solid var(--th-border)",
              borderRadius: "5px",
              fontFamily: "inherit",
              opacity: searchFocused ? 0 : 1,
              transition: "opacity 0.15s",
              pointerEvents: "none",
              letterSpacing: "0.01em",
            }}>⌘K</kbd>
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

          {/* Notifications */}
          {/* <div ref={notifRef} style={{ position: "relative" }}>
            <button
              className="th-icon-btn"
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              style={{ color: notifOpen ? "var(--th-accent)" : undefined }}
            >
              <Bell style={{ width: 15, height: 15 }} />
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 6, height: 6,
                borderRadius: "50%",
                background: "#ef4444",
                border: "1.5px solid var(--th-bg)",
              }} />
            </button>

            {notifOpen && (
              <div className="th-dropdown" style={{ width: 300, right: 0 }}>
                <div style={{
                  padding: "12px 14px 10px",
                  borderBottom: "1px solid var(--th-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--th-text-primary)" }}>{t('topHeader.notifications')}</span>
                  <span style={{
                    fontSize: "11px",
                    color: "var(--th-accent)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}>{t('topHeader.markAllRead')}</span>
                </div>
                {notifications.map((n) => (
                  <div key={n.id} className="th-menu-item" style={{ gap: "12px", padding: "10px 14px", alignItems: "flex-start" }}>
                    <span className={cn("th-notif-dot", !n.unread && "read")} style={{ marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: n.unread ? 500 : 400, color: "var(--th-text-primary)", lineHeight: 1.4 }}>{n.title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--th-text-muted)", lineHeight: 1.4 }}>{n.desc}</p>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--th-text-muted)", flexShrink: 0, marginTop: 2 }}>{n.time}</span>
                  </div>
                ))}
                <div style={{ padding: "8px 14px", borderTop: "1px solid var(--th-border)" }}>
                  <span style={{ fontSize: "12px", color: "var(--th-accent)", cursor: "pointer", fontWeight: 500 }}>{t('topHeader.viewAll')} →</span>
                </div>
              </div>
            )}
          </div> */}

          {/* Divider */}
          <div style={{ width: "1px", height: "20px", background: "var(--th-divider)", margin: "0 6px" }} />

          {/* Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "9px",
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
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" />
                  <AvatarFallback style={{
                    background: "var(--th-accent-bg)",
                    color: "var(--th-accent)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}>AZ</AvatarFallback>
                </Avatar>
                <span style={{
                  position: "absolute", bottom: 0, 
                  [i18n.language === 'ar' ? 'left' : 'right']: 0,
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  border: "1.5px solid var(--th-bg)",
                } as any} />
              </div>

              <div style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "var(--th-text-primary)", lineHeight: 1.3, whiteSpace: "nowrap" }}>
                  {t('topHeader.userName')}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--th-text-muted)", lineHeight: 1.3 }}>
                  {t('topHeader.userRole')}
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
                width: 170, 
                [i18n.language === 'ar' ? 'left' : 'right']: -20 
              } as any}>
                {/* User card */}
                <div style={{
                  padding: "14px",
                  borderBottom: "1px solid var(--th-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
                } as any}>
                  <Avatar style={{ width: 38, height: 38, border: "1.5px solid var(--th-accent-faint)", borderRadius: "50%", flexShrink: 0 }}>
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" />
                    <AvatarFallback style={{ background: "var(--th-accent-bg)", color: "var(--th-accent)", fontSize: "12px", fontWeight: 600 }}>AZ</AvatarFallback>
                  </Avatar>
                  <div style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "var(--th-text-primary)", lineHeight: 1.4 }}>{t('topHeader.userName')}</p>
                    <p style={{ margin: 0, fontSize: "11.5px", color: "var(--th-text-muted)" }}>{t('topHeader.userRole')}</p>
                  </div>
                </div>

                <div style={{ padding: "6px" }}>
                  <div className="th-menu-item danger" style={{ 
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexDirection: i18n.language === 'ar' ? 'row-reverse' : 'row',
                    justifyContent: 'start'
                  } as any} onClick={handleSignOut}>
                    <LogOut style={{ width: 14, height: 14, flexShrink: 0 }} />
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
