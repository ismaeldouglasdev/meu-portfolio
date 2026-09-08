import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from '../i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import { track } from '../lib/analytics';

const sectionKeys = ['sobre', 'servicos', 'skills', 'projetos', 'experiencia', 'contato'] as const;
type SectionKey = typeof sectionKeys[number];

function Navbar() {
  const { t, lang, setLang } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [langMessage, setLangMessage] = useState('');
  const isHome = location.pathname === '/';

useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#0a0a0a');
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

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
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#' + id);
    }
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
        <a
          onClick={() => track('portfolio_to_blog', '/')}
          href="https://blog.ismaeltech.com/"
          className="navbar-blog-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.blog.label}
        </a>
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
          style={{ fontSize: '0.8rem', fontWeight: 600 }}
        >
          {lang === 'pt-BR' ? 'PT' : 'EN'}
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
