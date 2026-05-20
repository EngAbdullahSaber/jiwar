import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

const applyDirection = (lng: string) => {
  const isAr = lng === 'ar';
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

// Handle RTL for future language changes
i18n.on('languageChanged', applyDirection);

// Apply immediately — languageChanged fires during init BEFORE this listener
// was attached, so the initial direction is never set without this line.
applyDirection(i18n.language);

export default i18n;
