import { useState } from "react";
import { useLocation } from "wouter";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/redux/slices/authSlice";
import api from "@/lib/api";
import "./auth.css";

export const Login = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t("auth.errorEmptyFields"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });

      const responseData = response.data;
      const user = responseData.data;
      const token = user?.token;
      
      if (token) {
        localStorage.setItem("token", token);
        dispatch(setCredentials({ user }));

        // Find first available path based on permissions
        const priorityPaths = [
          { path: "/dashboard", resource: "resources-dashboard" },
          { path: "/legality", resource: "legality" },
          { path: "/projects", resource: "project" },
          { path: "/templates", resource: "template" },
          { path: "/apartments", resource: "apartment" },
          { path: "/clients", resource: "client" },
          { path: "/salesman", resource: "salesman" },
          { path: "/contracts", resource: "contract" },
          { path: "/finance-dashboard", resource: "finance-dashboard" },
          { path: "/finance-dashboard", resource: "statics" },
          { path: "/roles", resource: "role-permission" },
          { path: "/users", resource: "user" },
          { path: "/materials", resource: "material" },
          { path: "/countries", resource: "country" },
          { path: "/cities", resource: "city" },
          { path: "/banks", resource: "bank" },
        ];

        let nextPath = "/dashboard"; // Default fallback
        
        // Find first path user has READ access to
        const permissions = user?.role?.permissions || [];
        const firstMatch = priorityPaths.find(p => 
          permissions.some((perm: any) => {
            const normalizedResource = perm.resource.includes(':') ? perm.resource.split(':')[1] : perm.resource;
            return normalizedResource === p.resource && perm.actions?.includes('READ');
          })
        );

        if (firstMatch) {
          nextPath = firstMatch.path;
        }

        // Store where to go after loading screen
        localStorage.setItem("nextPath", nextPath);
        
        toast.success(t("common.success"));
        
        // Delay redirect slightly so toast is visible
        setTimeout(() => {
          setLocation("/loading");
        }, 800);
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      const messageData = error.response?.data?.message;
      let errorMessage = t("common.error");

      if (typeof messageData === 'object' && messageData !== null) {
        errorMessage = i18n.language === 'ar' ? messageData.arabic : messageData.english;
      } else if (typeof messageData === 'string') {
        errorMessage = messageData;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating orbs */}
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-orb auth-orb--3" />

      {/* Header */}
      <header className="auth-header">
        <img
          className="auth-logo"
          alt="Jiwar"
          src="/figmaAssets/layer-1.png"
        />
        <LanguageSwitcher />
      </header>

      {/* Main */}
      <main className="auth-main">
        <div className="auth-card">
          <div style={{ textAlign: "center" }}>
            <h1 className="auth-title">{t("auth.loginTitle")}</h1>
            <p className="auth-subtitle">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">
                {t("auth.email")}
              </label>
              <div className="auth-input-wrap">
                <UserIcon className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password" className="auth-label">
                  {t("auth.password")}
                </label>
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setLocation("/reset-password")}
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>
              <div className="auth-input-wrap">
                <LockIcon className="auth-input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")}
                  className="auth-input auth-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="auth-btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? t("auth.signingIn") : t("auth.signIn")}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <p className="auth-footer-text">
          {t("auth.copyright")}
        </p>
      </footer>
    </div>
  );
};
