import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language === "ar" ? "AR" : "EN";

  return (
    <div className="auth-lang-toggle">
      {["EN", "AR"].map((code) => (
        <button
          key={code}
          className={`auth-lang-btn ${currentLang === code ? "auth-lang-btn--active" : ""}`}
          onClick={() => changeLanguage(code.toLowerCase())}
        >
          {code}
        </button>
      ))}
    </div>
  );
};
