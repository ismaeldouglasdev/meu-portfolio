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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('portfolio-lang') as Lang | null;
    if (saved && (saved === 'pt-BR' || saved === 'en')) return saved;
    return detectBrowserLang();
  });

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
  }, [lang]);

  const value: I18nContextValue = { lang, t: translations[lang], setLang };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
