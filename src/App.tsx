import { useEffect, lazy, Suspense } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

const Sobre = lazy(() => import('./components/Sobre'));
const Processo = lazy(() => import('./components/Processo'));
const Servicos = lazy(() => import('./components/Servicos'));
const CtaStrip = lazy(() => import('./components/CtaStrip'));
const Skills = lazy(() => import('./components/Skills'));
const Projetos = lazy(() => import('./components/Projetos'));
const Depoimentos = lazy(() => import('./components/Depoimentos'));
const Experiencia = lazy(() => import('./components/Experiencia'));
const Precos = lazy(() => import('./components/Precos'));
const Beneficios = lazy(() => import('./components/Beneficios'));
const Contato = lazy(() => import('./components/Contato'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
    } catch {
      // localStorage indisponível
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    const sections = document.querySelectorAll('section:not(#hero)');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="App" id="main-content">
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <Sobre />
        <Processo />
        <Servicos />
        <CtaStrip />
        <Skills />
        <Projetos />
        <Depoimentos />
        <Experiencia />
        <Precos />
        <Beneficios />
        <Contato />
        <Footer />
      </Suspense>
    </main>
  );
}

export default App;
