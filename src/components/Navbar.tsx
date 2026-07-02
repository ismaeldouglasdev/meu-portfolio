import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import { FiSun, FiMoon } from 'react-icons/fi';

const sectionKeys = ['sobre', 'servicos', 'skills', 'projetos', 'experiencia', 'contato'] as const;
type SectionKey = typeof sectionKeys[number];

function Navbar() {
  const { t, lang, setLang } = useTranslation();
  const [tema, setTema] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [langMessage, setLangMessage] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') || 'light';
      setTema(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } catch {
      // localStorage indisponível
    }
  }, []);

  const toggleTheme = () => {
    const next = tema === 'light' ? 'dark' : 'light';
    setTema(next);
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch {
      // localStorage indisponível
    }
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (let i = sectionKeys.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionKeys[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionKeys[i]);
          return;
        }
      }
      setActiveSection('hero');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navLabels: Record<SectionKey, string> = {
    sobre: t.nav.sobre,
    servicos: t.nav.servicos,
    skills: t.nav.skills,
    projetos: t.nav.projetos,
    experiencia: t.nav.experiencia,
    contato: t.nav.contato,
  };

  return (
    <nav className="navbar">
      <a
        href="#hero"
        className="navbar-logo"
        onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
      >
        {'<'}<span className="navbar-logo-name">Ismael</span>{'/>'}
      </a>

      {menuOpen && (
        <div className="navbar-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <div
        className={`navbar-links${menuOpen ? ' open' : ''}`}
      >
        {sectionKeys.map((key) => (
          <a
            key={key}
            href={`#${key}`}
            className={activeSection === key ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(key); }}
          >
            {navLabels[key]}
          </a>
        ))}
      </div>

      <div className="navbar-right" role="toolbar" aria-label="Ferramentas">
        <button
          className="theme-btn"
          onClick={() => {
            const nextLang = lang === 'pt-BR' ? 'en' : 'pt-BR';
            setLang(nextLang);
            setLangMessage(nextLang === 'en' ? 'Language: English' : 'Idioma: Português');
          }}
          aria-label="Switch language"
          title={lang === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
          style={{ fontSize: '0.7rem', fontWeight: 600 }}
        >
          {lang === 'pt-BR' ? 'PT' : 'EN'}
        </button>

        <button
          className="theme-btn"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          title={tema === 'light' ? 'Modo escuro' : 'Modo claro'}
        >
          {tema === 'light' ? <FiSun /> : <FiMoon />}
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {langMessage}
      </div>
    </nav>
  );
}

export default Navbar;
