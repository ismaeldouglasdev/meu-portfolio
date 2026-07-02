import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Translation } from './types';
import ptBR from './pt-BR';
import en from './en';

type Lang = 'pt-BR' | 'en';

interface I18nContextValue {
  lang: Lang;
  t: Translation;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'pt-BR';
  const browserLang = navigator.language || navigator.languages?.[0] || '';
  if (browserLang.startsWith('pt')) return 'pt-BR';
  return 'en';
}

const translations: Record<Lang, Translation> = { 'pt-BR': ptBR, en };

function getSavedLang(): Lang {
  try {
    const saved = localStorage.getItem('portfolio-lang') as Lang | null;
    if (saved && (saved === 'pt-BR' || saved === 'en')) return saved;
  } catch {
    // localStorage indisponível (privacy mode, etc.)
  }
  return detectBrowserLang();
}

function saveLang(lang: Lang) {
  try {
    localStorage.setItem('portfolio-lang', lang);
  } catch {
    // localStorage indisponível — silencia
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getSavedLang);

  useEffect(() => {
    saveLang(lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  }, [lang]);

  const value: I18nContextValue = { lang, t: translations[lang], setLang };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
