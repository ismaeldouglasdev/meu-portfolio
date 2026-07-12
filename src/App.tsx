import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sobre from './components/Sobre';
import Processo from './components/Processo';
import Servicos from './components/Servicos';
import CtaStrip from './components/CtaStrip';
import Skills from './components/Skills';
import Projetos from './components/Projetos';
import Depoimentos from './components/Depoimentos';
import Experiencia from './components/Experiencia';
import Precos from './components/Precos';
import Beneficios from './components/Beneficios';
import Contato from './components/Contato';
import Footer from './components/Footer';
import CaseStudyPage from './components/CaseStudyPage';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnSection = useRef('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
    } catch {}
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const sections = document.querySelectorAll('section:not(#hero)');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const target = state?.scrollTo || sessionStorage.getItem('returnSection');
    if (target) {
      sessionStorage.removeItem('returnSection');
      requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    }
  }, [location]);

  const openCaseStudy = (slug: string) => {
    const ids = ['depoimentos', 'experiencia', 'precos', 'beneficios', 'contato'];
    let best = 'depoimentos';
    let maxVis = 0;
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vis = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (vis > maxVis) { maxVis = vis; best = id; }
    });
    sessionStorage.setItem('returnSection', best);
    navigate(`/projetos/${slug}`);
  };

  return (
    <main className="App" id="main-content">
      <Navbar />
      <Hero />
      <Sobre />
      <Processo />
      <Servicos />
      <CtaStrip />
      <Skills />
      <Projetos />
      <Depoimentos onViewCaseStudy={openCaseStudy} />
      <Experiencia />
      <Precos />
      <Beneficios />
      <Contato />
      <Footer />
    </main>
  );
}

function CaseStudyRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Erro ao carregar o estudo de caso</h1>
        <pre style={{ textAlign: 'left', maxWidth: '600px', margin: '1rem auto', color: '#666' }}>
          {error.message}
        </pre>
        <button className="btn btn-outline" onClick={() => navigate('/')}>Voltar ao início</button>
      </div>
    );
  }

  try {
    return <CaseStudyPage slug={slug!} onBack={() => navigate('/')} />;
  } catch (e) {
    setError(e instanceof Error ? e : new Error(String(e)));
    return null;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projetos/:slug" element={<CaseStudyRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}