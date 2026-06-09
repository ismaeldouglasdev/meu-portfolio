import { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sobre from './components/Sobre';
import Processo from './components/Processo';
import Servicos from './components/Servicos';
import Skills from './components/Skills';
import Projetos from './components/Projetos';
import Experiencia from './components/Experiencia';
import FAQ from './components/FAQ';
import Contato from './components/Contato';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Sobre />
      <Processo />
      <Servicos />
      <Skills />
      <Projetos />
      <Experiencia />
      <FAQ />
      <Contato />
      <Footer />
    </div>
  );
}

export default App;
