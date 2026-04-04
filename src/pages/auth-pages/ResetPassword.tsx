import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import "./auth.css";

export const ResetPassword = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("resetEmail", email);
    setLocation("/verify");
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
            <MailIcon />
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 className="auth-title">{t("auth.resetPasswordTitle")}</h1>
            <p className="auth-subtitle">
              {t("auth.resetPasswordSubtitle")}
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
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-btn-primary">
              {t("auth.sendLink")}
            </button>

            {/* Back */}
            <button
              type="button"
              className="auth-btn-back"
              onClick={() => setLocation("/")}
            >
              <ArrowLeftIcon />
              <span>{t("auth.backToLogin")}</span>
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
