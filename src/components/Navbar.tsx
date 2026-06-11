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

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    setTema(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = tema === 'light' ? 'dark' : 'light';
    setTema(next);
    localStorage.setItem('portfolio-theme', next);
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
    if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
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

      <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {sectionKeys.map((key) => (
          <li key={key}>
            <a
              href={`#${key}`}
              className={activeSection === key ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollTo(key); }}
            >
              {navLabels[key]}
            </a>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <button
          className="theme-btn"
          onClick={() => setLang(lang === 'pt-BR' ? 'en' : 'pt-BR')}
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
          aria-label="Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
