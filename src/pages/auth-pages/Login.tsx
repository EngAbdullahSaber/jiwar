import { useState } from "react";
import { useLocation } from "wouter";
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import toast from "react-hot-toast";
import api from "@/lib/api";
import "./auth.css";

export const Login = (): JSX.Element => {
  const { t } = useTranslation();
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
      const token = responseData.token || responseData.data?.token;
      
      if (token) {
        localStorage.setItem("token", token);
      }
      
      toast.success(t("common.success"));
      
      // Store where to go after loading screen
      localStorage.setItem("nextPath", "/dashboard");
      
      // Delay redirect slightly so toast is visible
      setTimeout(() => {
        setLocation("/loading");
      }, 800);
      
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || t("common.error");
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
