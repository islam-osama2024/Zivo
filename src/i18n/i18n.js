import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import arTranslation from "./locales/ar/translation.json";

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources: {
    en: { translation: enTranslation },
    ar: { translation: arTranslation },
    },
    fallbackLng: "en",
    interpolation: {
    escapeValue: false,
    },
});

function applyDocumentDirection(lng) {
    const lang = (lng || "en").split("-")[0];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}
applyDocumentDirection(i18n.language);
i18n.on("languageChanged", applyDocumentDirection);

export default i18n;
