// Sidebar Component — Professional Redesign
import { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Home,
  Users,
  FileCheck,
  UserCircle,
  Gavel,
  ChevronRight,
  LogOut,
  Layers,
  Globe,
  Building2,
  Building
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/hooks/use-sidebar-store";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  badge?: string | number;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "dashboard",   path: "/dashboard",          },
  { icon: Gavel,           label: "legality",    path: "/legality",           },
  { icon: Briefcase,       label: "projects",    path: "/projects",           },
  { icon: FileText,        label: "templates",   path: "/templates",          },
  { icon: Home,            label: "apartments",  path: "/apartments",         },
  { icon: Users,           label: "clients",     path: "/clients",            },
  { icon: UserCircle,      label: "salesTeam",   path: "/salesman",          },
  { icon: FileCheck,       label: "contracts",   path: "/contracts",            },
  // // { icon: PieChart,        label: "finance",     path: "/finance-dashboard",  },
  // { icon: ShieldAlert,     label: "roles",       path: "/roles",              },
  // { icon: Users,           label: "users",       path: "/users",              },
  { icon: Layers,          label: "materials",   path: "/materials",          },
  { icon: Globe,           label: "countries",   path: "/countries",          },
  { icon: Building2,       label: "cities",      path: "/cities",             },
  { icon: Building,        label: "banks",       path: "/banks",              },
];

export function Sidebar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isExpanded: expanded, toggle: toggleExpanded } = useSidebarStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'));

    // Observe theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cairo:wght@400;600;700&family=Cormorant+Garamond:wght@400;600&display=swap');

        .sb-root {
          font-family: 'Inter', 'Cairo', sans-serif;
          --sb-w-open:  272px;
          --sb-w-close: 68px;
          --sb-accent:       #8A4A1A;
          --sb-accent-soft:  rgba(138,74,26,0.08);
          --sb-accent-mid:   rgba(138,74,26,0.18);
          --sb-accent-glow:  rgba(138,74,26,0.22);
          --sb-gold:         #C4935A;
          --sb-gold-soft:    rgba(196,147,90,0.12);
          --sb-bg:           #FAFAF8;
          --sb-surface:      #F4F1EC;
          --sb-border:       rgba(0,0,0,0.07);
          --sb-border-mid:   rgba(0,0,0,0.11);
          --sb-text-hi:      #1A1208;
          --sb-text-mid:     #6B5E50;
          --sb-text-lo:      #A8998A;
          --sb-shadow:       0 20px 60px rgba(0,0,0,0.08);
        }
        .dark .sb-root {
          --sb-accent:       #D4A574;
          --sb-accent-soft:  rgba(212,165,116,0.08);
          --sb-accent-mid:   rgba(212,165,116,0.16);
          --sb-accent-glow:  rgba(212,165,116,0.2);
          --sb-gold:         #D4A574;
          --sb-gold-soft:    rgba(212,165,116,0.1);
          --sb-bg:           #100E0B;
          --sb-surface:      #181410;
          --sb-border:       rgba(255,255,255,0.06);
          --sb-border-mid:   rgba(255,255,255,0.1);
          --sb-text-hi:      #F0E8DC;
          --sb-text-mid:     #8C7B6A;
          --sb-text-lo:      #50443A;
          --sb-shadow:       0 20px 60px rgba(0,0,0,0.4);
        }

        /* Scrollbar */
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-track { background: transparent; }
        .sb-nav::-webkit-scrollbar-thumb { background: var(--sb-border-mid); border-radius: 2px; }

        /* Nav item */
        .sb-item {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
          color: var(--sb-text-mid);
          user-select: none;
          -webkit-user-select: none;
        }
        .sb-item:hover {
          background: var(--sb-surface);
          color: var(--sb-text-hi);
        }
        .sb-item.active {
          background: var(--sb-accent-soft);
          color: var(--sb-accent);
        }
        .sb-item.active .sb-item-icon-wrap {
          background: var(--sb-accent-mid);
          color: var(--sb-accent);
        }

        .sb-item-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
          color: inherit;
        }

        .sb-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          background: var(--sb-accent-mid);
          color: var(--sb-accent);
          letter-spacing: 0.01em;
          flex-shrink: 0;
        }

        /* Active rail */
        .sb-item.active::before {
          content: '';
          position: absolute;
          inset-inline-start: -1px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          border-radius: 0 3px 3px 0;
          background: var(--sb-gold);
        }

        /* Tooltip for collapsed */
        .sb-tooltip {
          position: absolute;
          inset-inline-start: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--sb-text-hi);
          color: var(--sb-bg);
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 99;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .sb-tooltip::before {
          content: '';
          position: absolute;
          inset-inline-end: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-inline-end-color: var(--sb-text-hi);
        }
        .sb-item:hover .sb-tooltip { opacity: 1; }

        /* AI card shine */
        @keyframes sb-shine {
          0%   { background-position: -200% 0; }
          100% { background-position: 300% 0; }
        }
        .sb-ai-card {
          position: relative;
          border-radius: 12px;
          background: var(--sb-surface);
          border: 1px solid var(--sb-border);
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .sb-ai-card:hover { border-color: var(--sb-gold); }
        .sb-ai-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(196,147,90,0.12) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .sb-ai-card:hover::after {
          opacity: 1;
          animation: sb-shine 1.6s linear;
        }

        /* Toggle btn */
        .sb-toggle {
          position: absolute;
          inset-inline-end: -11px;
          top: 72px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--sb-bg);
          border: 1px solid var(--sb-border-mid);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
          z-index: 50;
        }
        .sb-toggle:hover {
          background: var(--sb-surface);
          box-shadow: 0 4px 14px rgba(0,0,0,0.14);
          transform: scale(1.1);
        }

        /* Bottom action btns */
        .sb-action-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--sb-text-mid);
          font-family: 'Inter', 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 400;
          transition: background 0.15s, color 0.15s;
          width: 100%;
        }
        .sb-action-btn:hover {
          background: var(--sb-surface);
          color: var(--sb-text-hi);
        }
        .sb-action-btn.danger:hover {
          background: rgba(239,68,68,0.07);
          color: #ef4444;
        }
      `}</style>

      <div
        className="sb-root"
        style={{
          height: "100vh",
          width: expanded ? "var(--sb-w-open)" : "var(--sb-w-close)",
          background: "var(--sb-bg)",
          borderInlineEnd: "1px solid var(--sb-border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          insetInlineStart: 0,
          top: 0,
          zIndex: 30,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "var(--sb-shadow)",
         }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, var(--sb-gold) 50%, transparent 100%)",
          opacity: 0.6,
        }} />

        {/* Toggle button */}
        <button className="sb-toggle" onClick={toggleExpanded}>
          <ChevronRight style={{
            width: 11, height: 11,
            color: "var(--sb-text-mid)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }} />
        </button>

        {/* ── LOGO ── */}
        <div style={{
          padding: expanded ? "28px 20px 20px" : "28px 0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "flex-start" : "center",
          gap: 12,
          flexShrink: 0,
        }}>
          {/* Logo mark */}
    
            <img
              src={isDark ? "/logo-dark.png" : "/logo-white.png"}
              alt="Jiwar"
              style={{ width: 100, height: 70, objectFit: "contain" }}
            />
  
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--sb-border)", marginInline: expanded ? 16 : 12, flexShrink: 0 }} />

        {/* ── NAV ── */}
        <div
          className="sb-nav"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: expanded ? "12px 10px" : "12px 8px",
          }}
        >
              <p style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--sb-text-lo)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                paddingInline: "8px",
                marginBottom: "8px",
                marginTop: "4px",
              }}>{t('sidebar.navigation')}</p>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {menuItems.map((item) => {
              const isActive =
                location === item.path ||
                (item.path !== "/" && location.startsWith(item.path));

              return (
                <Link key={item.label} href={item.path} className={cn("sb-item", isActive && "active")} style={{
                      padding: expanded ? "8px 10px" : "10px",
                      justifyContent: expanded ? "flex-start" : "center",
                      gap: expanded ? 10 : 0,
                    }}>
                    {/* Icon */}
                    <div
                      className="sb-item-icon-wrap"
                      style={{
                        width: expanded ? 30 : 36,
                        height: expanded ? 30 : 36,
                      }}
                    >
                      <item.icon style={{ width: 15, height: 15 }} />

                      {/* Collapsed badge */}
                      {!expanded && item.badge && (
                        <span style={{
                          position: "absolute",
                          top: 4, insetInlineEnd: 4,
                          width: 14, height: 14,
                          borderRadius: "50%",
                          background: "var(--sb-gold)",
                          color: "#fff",
                          fontSize: "8px",
                          fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Label + badge */}
                    {expanded && (
                      <>
                        <span style={{ flex: 1, fontSize: "13.5px", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {t(`sidebar.${item.label}`)}
                        </span>
                        {item.badge && (
                          <span className="sb-badge">{item.badge}</span>
                        )}
                      </>
                    )}

                    {/* Tooltip (collapsed only) */}
                    {!expanded && (
                      <span className="sb-tooltip">{t(`sidebar.${item.label}`)}</span>
                    )}
                </Link>
              );
            })}
          </nav>
 
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--sb-border)", marginInline: expanded ? 16 : 12, flexShrink: 0 }} />

        {/* ── BOTTOM ── */}
        <div style={{ padding: expanded ? "12px 10px" : "12px 8px", flexShrink: 0 }}>
          {/* User row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px",
            borderRadius: 10,
            marginBottom: 6,
            cursor: "pointer",
            transition: "background 0.15s",
            justifyContent: expanded ? "flex-start" : "center",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--sb-surface)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 34, height: 34,
                borderRadius: 9,
                background: "linear-gradient(145deg, #5C1E0A, #8A3A18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 600, color: "#fff",
                letterSpacing: "0.02em",
              }}>
                AZ
              </div>
              <span style={{
                position: "absolute",
                bottom: 0, insetInlineEnd: 0,
                width: 8, height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                border: "1.5px solid var(--sb-bg)",
              }} />
            </div>

            {expanded && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "var(--sb-text-hi)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Ahmed Al-Zahrani
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--sb-text-lo)" }}>
                  Senior Manager
                </p>
              </div>
            )}
          </div>

          {/* Settings + Logout */}
          <div style={{
            display: "flex",
            flexDirection: expanded ? "row" : "column",
            gap: 4,
          }}>
        
            <button
              className="sb-action-btn danger"
              style={{ justifyContent: expanded ? "flex-start" : "center" }}
            >
              <LogOut style={{ width: 14, height: 14, flexShrink: 0 }} />
              {expanded && t('common.signOut')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}