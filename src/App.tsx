import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import './App.css';
import { track } from './lib/analytics';
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
import QuizLead from './components/QuizLead';

// Code-splitting: blog traz remark-gfm + rehype-highlight (~200KB)
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const Sitemap = lazy(() => import('./components/Sitemap'));
const Feed = lazy(() => import('./components/Feed'));
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

function RouteFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
      <span className="section-label">Carregando…</span>
    </div>
  );
}

const isBlogDomain = window.location.hostname === 'blog.ismaeltech.com';

function HomePage() {
  const navigate = useNavigate();
  const [quizDone, setQuizDone] = React.useState<boolean>(false);

  useEffect(() => {
    const onQuizCompleted = () => setQuizDone(true);
    const onQuizReset = () => setQuizDone(false);
    window.addEventListener('quiz-completed', onQuizCompleted);
    window.addEventListener('quiz-reset', onQuizReset);
    return () => {
      window.removeEventListener('quiz-completed', onQuizCompleted);
      window.removeEventListener('quiz-reset', onQuizReset);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
    } catch {}
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const savedSection = sessionStorage.getItem('returnSection');
    const target = hash || savedSection;
    
    if (target) {
      sessionStorage.removeItem('returnSection');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 150);
    }
  }, []);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section:not(#hero)').forEach(sec => {
      observer.observe(sec);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="App" id="main-content">
      <Hero />
      <Sobre />
      <Processo />
      <Servicos />
      <CtaStrip />
      <Skills />
      <Projetos />
      <Depoimentos onViewCaseStudy={openCaseStudy} />
      <Experiencia />
      <QuizLead />
      {quizDone && <Precos />}
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

function BlogRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<BlogPage />} />
        <Route path="/sitemap.xml" element={<Sitemap />} />
        <Route path="/feed.xml" element={<Feed />} />
        <Route path="/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function PortfolioRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projetos/:slug" element={<CaseStudyRoute />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    track('pageview', location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      {isBlogDomain ? <BlogRoutes /> : <><Navbar /><PortfolioRoutes /></>}
    </BrowserRouter>
  );
}
