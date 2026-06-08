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
  Building,
  ShieldAlert,
  PieChart,
  GitBranch
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/slices/authSlice";

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  resource?: string;
  badge?: string | number;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "dashboard",        path: "/dashboard",         resource: "resources-dashboard" },
  { icon: Gavel,           label: "legality",         path: "/legality",          resource: "legality"            },
  { icon: Briefcase,       label: "projects",         path: "/projects",          resource: "project"             },
  { icon: GitBranch,       label: "stages",           path: "/stages",            resource: "stage"               },
  { icon: FileText,        label: "templates",        path: "/templates",         resource: "template"            },
  { icon: Home,            label: "apartments",       path: "/apartments",        resource: "apartment"           },
  { icon: Users,           label: "clients",          path: "/clients",           resource: "client"              },
  { icon: UserCircle,      label: "salesTeam",        path: "/salesman",          resource: "salesman"            },
  { icon: FileCheck,       label: "contracts",        path: "/contracts",         resource: "contract"            },
  { icon: FileCheck,       label: "approveContracts", path: "/approve-contracts", resource: "contract-approval"   },
  { icon: FileText,        label: "contractTemplates", path: "/contract-templates", resource: "contract-template"  },
  { icon: PieChart,        label: "financeDashboard", path: "/finance-dashboard", resource: "finance-dashboard"   },
  { icon: ShieldAlert,     label: "roles",            path: "/roles",             resource: "role-permission"     },
  { icon: Users,           label: "users",            path: "/users",             resource: "user"                },
  { icon: Layers,          label: "materials",        path: "/materials",         resource: "material"            },
  { icon: Globe,           label: "countries",        path: "/countries",         resource: "country"             },
  { icon: Building2,       label: "cities",           path: "/cities",            resource: "city"                },
  { icon: Building,        label: "banks",            path: "/banks",             resource: "bank"                },
];

export function Sidebar() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { user } = useAppSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();
  const { isExpanded: expanded, toggle: toggleExpanded } = useSidebarStore();
  const [isDark, setIsDark] = useState(false);

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.resource) return true;

    const hasPerm = user?.role?.permissions?.some((p: any) => {
      const normalizedResource = p.resource.includes(':') ? p.resource.split(':')[1] : p.resource;
      return (
        normalizedResource === item.resource ||
        p.resource === item.resource ||
        p.resource === `read:${item.resource}`
      ) && p.actions?.includes('READ');
    });

    if (!hasPerm && item.resource === 'finance-dashboard') {
      return user?.role?.permissions?.some((p: any) =>
        (p.resource === 'statics' || p.resource === 'read:statics') && p.actions?.includes('READ')
      ) || false;
    }

    return hasPerm || false;
  });

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setLocation('/');
  };

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .sb-root {
          font-family: 'Plus Jakarta Sans', 'Cairo', sans-serif;
          --sb-w-open:  272px;
          --sb-w-close: 68px;
          --sb-accent:       #8A4A1A;
          --sb-accent-soft:  rgba(138,74,26,0.07);
          --sb-accent-mid:   rgba(138,74,26,0.15);
          --sb-gold:         #B39371;
          --sb-bg:           #FAFAF8;
          --sb-surface:      #F2EEE9;
          --sb-border:       rgba(0,0,0,0.07);
          --sb-border-mid:   rgba(0,0,0,0.10);
          --sb-text-hi:      #1A1208;
          --sb-text-mid:     #6B5E50;
          --sb-text-lo:      #B0A090;
        }
        .dark .sb-root {
          --sb-accent:       #C9A47A;
          --sb-accent-soft:  rgba(201,164,122,0.08);
          --sb-accent-mid:   rgba(201,164,122,0.15);
          --sb-gold:         #C9A47A;
          --sb-bg:           #0F0D0B;
          --sb-surface:      #181410;
          --sb-border:       rgba(255,255,255,0.06);
          --sb-border-mid:   rgba(255,255,255,0.09);
          --sb-text-hi:      #EDE4D8;
          --sb-text-mid:     #8C7B6A;
          --sb-text-lo:      #4A3E34;
        }

        .sb-nav::-webkit-scrollbar { width: 2px; }
        .sb-nav::-webkit-scrollbar-track { background: transparent; }
        .sb-nav::-webkit-scrollbar-thumb { background: var(--sb-border-mid); border-radius: 2px; }

        .sb-item {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          color: var(--sb-text-mid);
          transition: background 0.12s, color 0.12s;
          user-select: none;
        }
        .sb-item:hover {
          background: var(--sb-surface);
          color: var(--sb-text-hi);
        }
        .sb-item.active {
          background: var(--sb-accent-soft);
          color: var(--sb-accent);
        }
        .sb-item.active .sb-icon {
          background: var(--sb-accent-mid);
          color: var(--sb-accent);
        }
        .sb-item.active::before {
          content: '';
          position: absolute;
          inset-inline-start: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          border-radius: 0 3px 3px 0;
          background: var(--sb-gold);
        }

        .sb-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          flex-shrink: 0;
          transition: background 0.12s, color 0.12s;
          color: inherit;
        }

        .sb-tooltip {
          position: absolute;
          inset-inline-start: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--sb-text-hi);
          color: var(--sb-bg);
          font-size: 11.5px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.12s;
          z-index: 99;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: 'Plus Jakarta Sans', 'Cairo', sans-serif;
        }
        .sb-tooltip::before {
          content: '';
          position: absolute;
          inset-inline-end: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-inline-end-color: var(--sb-text-hi);
        }
        .sb-item:hover .sb-tooltip { opacity: 1; }

        .sb-toggle {
          position: absolute;
          inset-inline-end: -10px;
          top: 68px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--sb-bg);
          border: 1px solid var(--sb-border-mid);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          transition: background 0.12s, box-shadow 0.12s;
          z-index: 50;
        }
        .sb-toggle:hover {
          background: var(--sb-surface);
          box-shadow: 0 3px 10px rgba(0,0,0,0.12);
        }

        .sb-logout {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--sb-text-mid);
          font-family: 'Plus Jakarta Sans', 'Cairo', sans-serif;
          font-size: 13px;
          font-weight: 400;
          transition: background 0.12s, color 0.12s;
          width: 100%;
        }
        .sb-logout:hover {
          background: rgba(239,68,68,0.07);
          color: #ef4444;
        }

        .sb-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 6px;
          margin-bottom: 4px;
          transition: background 0.12s;
        }
        .sb-user-row:hover { background: var(--sb-surface); }
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
          transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, var(--sb-gold) 50%, transparent 100%)",
          opacity: 0.5,
          pointerEvents: "none",
        }} />

        {/* Toggle button */}
        <button className="sb-toggle" onClick={toggleExpanded} aria-label="Toggle sidebar">
          <ChevronRight style={{
            width: 10, height: 10,
            color: "var(--sb-text-mid)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s",
          }} />
        </button>

        {/* Logo */}
        <div style={{
          padding: expanded ? "24px 20px 18px" : "24px 0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "flex-start" : "center",
          flexShrink: 0,
          minHeight: 88,
        }}>
          <img
            src={isDark ? "/logo-dark.png" : "/logo-white.png"}
            alt="Jiwar"
            style={{ width: expanded ? 96 : 36, height: 52, objectFit: "contain", transition: "width 0.28s" }}
          />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--sb-border)", marginInline: 12, flexShrink: 0 }} />

        {/* Nav */}
        <div
          className="sb-nav"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px 8px",
          }}
        >
          {expanded && (
            <p style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--sb-text-lo)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              paddingInline: "10px",
              marginBottom: "6px",
              marginTop: "2px",
            }}>
              {t('sidebar.navigation')}
            </p>
          )}

          <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filteredMenuItems.map((item) => {
              const isActive =
                location === item.path ||
                (item.path !== "/" && location.startsWith(item.path));

              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={cn("sb-item", isActive && "active")}
                  style={{
                    padding: expanded ? "7px 10px" : "10px",
                    justifyContent: expanded ? "flex-start" : "center",
                    gap: expanded ? 9 : 0,
                  }}
                >
                  <div
                    className="sb-icon"
                    style={{ width: expanded ? 28 : 34, height: expanded ? 28 : 34 }}
                  >
                    <item.icon style={{ width: 14, height: 14 }} />
                  </div>

                  {expanded && (
                    <>
                      <span style={{
                        flex: 1,
                        fontSize: "13px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {t(`sidebar.${item.label}`)}
                      </span>
                      {item.badge && (
                        <span style={{
                          minWidth: 17,
                          height: 17,
                          padding: "0 4px",
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 600,
                          background: "var(--sb-accent-mid)",
                          color: "var(--sb-accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {!expanded && (
                    <span className="sb-tooltip">{t(`sidebar.${item.label}`)}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--sb-border)", marginInline: 12, flexShrink: 0 }} />

        {/* Bottom */}
        <div style={{ padding: "10px 8px", flexShrink: 0 }}>
          {/* User row */}
          <div
            className="sb-user-row"
            style={{ justifyContent: expanded ? "flex-start" : "center" }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: 6,
                background: "linear-gradient(145deg, #5C1E0A, #8A3A18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "0.03em",
              }}>
                {user?.email?.substring(0, 2).toUpperCase() || 'JW'}
              </div>
              <span style={{
                position: "absolute",
                bottom: -1, insetInlineEnd: -1,
                width: 8, height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                border: "1.5px solid var(--sb-bg)",
              }} />
            </div>

            {expanded && (
              <div style={{ overflow: "hidden", flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--sb-text-hi)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {user?.email || "—"}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--sb-text-lo)", marginTop: 1 }}>
                  {user?.role?.name || "—"}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            className="sb-logout"
            style={{ justifyContent: expanded ? "flex-start" : "center" }}
            onClick={handleLogout}
          >
            <LogOut style={{ width: 14, height: 14, flexShrink: 0 }} />
            {expanded && <span>{t('common.signOut')}</span>}
          </button>
        </div>
      </div>
    </>
  );
}
