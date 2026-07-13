import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// One namespace per domain (mirrors the components/<domain>/ folders), so a
// translation file is only ever owned by one area of the app.
import ptCommon from '@/locales/pt/common.json';
import ptLayout from '@/locales/pt/layout.json';
import ptProjetos from '@/locales/pt/projetos.json';
import ptHoras from '@/locales/pt/horas.json';
import ptFerias from '@/locales/pt/ferias.json';
import ptExtra from '@/locales/pt/extra.json';
import ptUtilizadores from '@/locales/pt/utilizadores.json';
import ptDias from '@/locales/pt/dias.json';
import ptTipoTrabalho from '@/locales/pt/tipoTrabalho.json';
import ptAuth from '@/locales/pt/auth.json';
import ptForms from '@/locales/pt/forms.json';

import enCommon from '@/locales/en/common.json';
import enLayout from '@/locales/en/layout.json';
import enProjetos from '@/locales/en/projetos.json';
import enHoras from '@/locales/en/horas.json';
import enFerias from '@/locales/en/ferias.json';
import enExtra from '@/locales/en/extra.json';
import enUtilizadores from '@/locales/en/utilizadores.json';
import enDias from '@/locales/en/dias.json';
import enTipoTrabalho from '@/locales/en/tipoTrabalho.json';
import enAuth from '@/locales/en/auth.json';
import enForms from '@/locales/en/forms.json';

import esCommon from '@/locales/es/common.json';
import esLayout from '@/locales/es/layout.json';
import esProjetos from '@/locales/es/projetos.json';
import esHoras from '@/locales/es/horas.json';
import esFerias from '@/locales/es/ferias.json';
import esExtra from '@/locales/es/extra.json';
import esUtilizadores from '@/locales/es/utilizadores.json';
import esDias from '@/locales/es/dias.json';
import esTipoTrabalho from '@/locales/es/tipoTrabalho.json';
import esAuth from '@/locales/es/auth.json';
import esForms from '@/locales/es/forms.json';

export const LANGUAGE_STORAGE_KEY = 'gestao-horas-lang';

export const LANGUAGES = [
  { code: 'pt', label: 'Português', short: 'PT' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
];

export const NAMESPACES = [
  'common',
  'layout',
  'projetos',
  'horas',
  'ferias',
  'extra',
  'utilizadores',
  'dias',
  'tipoTrabalho',
  'auth',
  'forms',
];

const resources = {
  pt: {
    common: ptCommon,
    layout: ptLayout,
    projetos: ptProjetos,
    horas: ptHoras,
    ferias: ptFerias,
    extra: ptExtra,
    utilizadores: ptUtilizadores,
    dias: ptDias,
    tipoTrabalho: ptTipoTrabalho,
    auth: ptAuth,
    forms: ptForms,
  },
  en: {
    common: enCommon,
    layout: enLayout,
    projetos: enProjetos,
    horas: enHoras,
    ferias: enFerias,
    extra: enExtra,
    utilizadores: enUtilizadores,
    dias: enDias,
    tipoTrabalho: enTipoTrabalho,
    auth: enAuth,
    forms: enForms,
  },
  es: {
    common: esCommon,
    layout: esLayout,
    projetos: esProjetos,
    horas: esHoras,
    ferias: esFerias,
    extra: esExtra,
    utilizadores: esUtilizadores,
    dias: esDias,
    tipoTrabalho: esTipoTrabalho,
    auth: esAuth,
    forms: esForms,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt', // the app was written in PT — it is the source of truth
    supportedLngs: LANGUAGES.map((l) => l.code),
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    returnEmptyString: false, // an empty value falls back instead of rendering ''
  });

// Keep <html lang> in sync (accessibility + correct hyphenation/spellcheck).
const applyHtmlLang = (lng) => {
  document.documentElement.setAttribute('lang', lng);
};
applyHtmlLang(i18n.resolvedLanguage || 'pt');
i18n.on('languageChanged', applyHtmlLang);

export default i18n;
