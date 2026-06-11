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
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
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
    <div className="App">
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
    </div>
  );
}

export default App;
