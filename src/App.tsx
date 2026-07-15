import { useEffect } from 'react';
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
    const sections = document.querySelectorAll('section:not(#hero)');
    
    // Fallback: make sections visible immediately to prevent blank page
    sections.forEach((s) => s.classList.add('visible'));
    
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

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

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
      <Depoimentos />
      <Experiencia />
      <Precos />
      <Beneficios />
      <Contato />
      <Footer />
    </main>
  );
}

export default App;
