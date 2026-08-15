import { useState, useEffect, useCallback } from 'react';

interface Props {
  phrases: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseAfter?: number;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Typewriter({
  phrases,
  speed = 65,
  deleteSpeed = 35,
  pauseAfter = 2500,
  className = '',
}: Props) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const currentPhrase = phrases[phraseIdx] ?? '';

  // Spacers invisíveis: todas as frases ocupam a mesma célula do grid (grid-area 1/1).
  // Com o mesmo nº de caracteres por linha, quebram igual em qualquer viewport —
  // a altura da célula é a da frase mais alta (idêntica à do texto) → zero espaço vazio.

  const nextPhrase = useCallback(() => {
    setPhraseIdx((prev) => (prev + 1) % phrases.length);
  }, [phrases.length]);

  // Reduced motion: show last phrase immediately, no animation
  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(phrases[phrases.length - 1] ?? '');
      return;
    }
  }, [reducedMotion, phrases]);

  useEffect(() => {
    if (reducedMotion || !currentPhrase) return;

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseAfter);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting) {
      if (displayed === '') {
        setIsDeleting(false);
        nextPhrase();
        return;
      }
      const timer = setTimeout(() => {
        setDisplayed(currentPhrase.slice(0, displayed.length - 1));
      }, deleteSpeed);
      return () => clearTimeout(timer);
    }

    if (displayed === currentPhrase) {
      setIsPaused(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(currentPhrase.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, isPaused, currentPhrase, speed, deleteSpeed, pauseAfter, nextPhrase, reducedMotion]);

  return (
    <span className={className}>
      {phrases.map((phrase) => (
        <span className="typewriter-spacer" aria-hidden="true" key={phrase}>
          {phrase}
        </span>
      ))}
      <span className="typewriter-text">
        {displayed}
        {!reducedMotion && <span className="typewriter-cursor" aria-hidden="true">|</span>}
      </span>
    </span>
  );
}

export default Typewriter;
