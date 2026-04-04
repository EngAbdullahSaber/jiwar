import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeftIcon, ShieldCheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import toast from "react-hot-toast";
import api from "@/lib/api";
import "./auth.css";

export const Verify = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found, redirect back to reset password
      toast.error(t("auth.errorNoEmail") || "No email found. Please start over.");
      setLocation("/reset-password");
    }
  }, [setLocation, t]);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await api.post("/user/resend-otp", { email });
      toast.success(t("auth.successResend") || "Verification code resent successfully!");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      const errorMessage = error.response?.data?.message || t("common.error");
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsLoading(true);
      try {
        await api.post("/user/validate-otp", {
          email,
          otp,
        });
        
        toast.success(t("auth.successVerify") || "OTP verified successfully!");
        
        localStorage.setItem("nextPath", "/new-password");
        setTimeout(() => {
          setLocation("/loading");
        }, 800);
      } catch (error: any) {
        console.error("OTP validation error:", error);
        const errorMessage = error.response?.data?.message || t("auth.errorInvalidOtp") || "Invalid OTP. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error(t("auth.errorOtpLength") || "Please enter a 6-digit code.");
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
            <ShieldCheckIcon />
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 className="auth-title">{t("auth.verifyEmail")}</h1>
            <p className="auth-subtitle">
              {t("auth.verifyEmailSubtitle")} <span style={{ fontWeight: 600 }}>{email}</span>. {t("auth.verifySubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* OTP Input */}
            <div className="auth-otp-container">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading || isResending}
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-[45px] h-[50px] md:w-[60px] md:h-[60px] text-2xl font-bold bg-slate-50 border-slate-200 rounded-xl transition-all duration-300 focus-within:border-[#bb9e80] focus-within:ring-4 focus-within:ring-[#bb9e80]/10"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-btn-primary"
              disabled={otp.length < 6 || isLoading || isResending}
            >
              {isLoading ? t("auth.verifying") : t("auth.verify")}
            </button>

            {/* Resend */}
            <p className="auth-resend">
              {t("auth.resendCode")}{" "}
              <button 
                type="button" 
                className="auth-resend-btn" 
                onClick={handleResend}
                disabled={isLoading || isResending}
              >
                {isResending ? t("auth.resending") : t("auth.resend")}
              </button>
            </p>

            {/* Back */}
            {!isLoading && (
              <button
                type="button"
                className="auth-btn-back"
                onClick={() => setLocation("/reset-password")}
              >
                <ArrowLeftIcon />
                <span>{t("auth.backToReset")}</span>
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
