import { use } from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fi } from "./languages";
import { FRONTEND_DEFAULT_LANGUAGE } from "./constants/frontend";

const resources = {
    en: {translation: en},
    fi: {translation: fi}
};

use(initReactI18next)
.init({
  resources,
  lng: FRONTEND_DEFAULT_LANGUAGE,
  interpolation: {
      escapeValue: false // react already safes from xss
  }
}).catch(err => {
  console.error(`Failed to initialize i18n: `, err);
});
