import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import toast from "react-hot-toast";
import api from "@/lib/api";
import "./auth.css";

export const NewPassword = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) score++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score++;
    return score;
  };

  const strength = getStrength();
  
  const getStrengthLabel = () => {
    if (strength <= 1) return t("auth.weak");
    if (strength <= 2) return t("auth.medium");
    if (strength <= 3) return t("auth.strong");
    return t("auth.veryStrong");
  }

  const strengthClass = strength <= 1 ? "auth-strength-level--weak" : strength <= 2 ? "auth-strength-level--medium" : "auth-strength-level--strong";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("auth.errorEmptyFields"));
      return;
    }

    if (newPassword !== retypeNewPassword) {
      toast.error(t("auth.errorPasswordsDontMatch"));
      return;
    }

    if (newPassword.length < 8) {
      toast.error(t("auth.errorPasswordTooShort"));
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/user/reset-password", {
        email,
        newPassword,
        retypeNewPassword
      });

      toast.success(t("auth.successPasswordReset"));
      
      localStorage.setItem("nextPath", "/");
      setTimeout(() => {
        setLocation("/loading");
      }, 800);
    } catch (error: any) {
      console.error("Reset password error:", error);
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
          {/* Icon */}
          <div className="auth-icon-circle">
            <LockIcon />
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 className="auth-title">{t("auth.newPasswordTitle")}</h1>
            <p className="auth-subtitle">
              {t("auth.newPasswordSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">
                {t("auth.email")}
              </label>
              <div className="auth-input-wrap">
                <MailIcon className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="auth-field">
              <label htmlFor="new-password" className="auth-label">
                {t("auth.password")}
              </label>
              <div className="auth-input-wrap">
                <LockIcon className="auth-input-icon" />
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="auth-input auth-input-password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Password strength */}
              {newPassword.length > 0 && (
                <div className="auth-strength">
                  <div className="auth-strength-header">
                    <span className="auth-strength-label">{t("auth.strengthLabel")}</span>
                    <span className={`auth-strength-level ${strengthClass}`}>
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="auth-strength-bars">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`auth-strength-bar ${i < strength ? "auth-strength-bar--filled" : ""}`}
                      />
                    ))}
                  </div>
                  <p className="auth-strength-hint">
                    {t("auth.strengthHint")}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="confirm-password" className="auth-label">
                {t("auth.confirmPassword")}
              </label>
              <div className="auth-input-wrap">
                <LockIcon className="auth-input-icon" />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  value={retypeNewPassword}
                  onChange={(e) => setRetypeNewPassword(e.target.value)}
                  className="auth-input auth-input-password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? t("auth.updatingPassword") : t("auth.updatePassword")}
            </button>

            {/* Back */}
            {!isLoading && (
              <button
                type="button"
                className="auth-btn-back"
                onClick={() => setLocation("/")}
              >
                <ArrowLeftIcon />
                <span>{t("auth.backToLogin")}</span>
              </button>
            )}
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

