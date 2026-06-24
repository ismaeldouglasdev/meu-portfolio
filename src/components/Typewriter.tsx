import { useState, useEffect, useCallback } from 'react';

interface Props {
  phrases: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseAfter?: number;
  className?: string;
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

  const currentPhrase = phrases[phraseIdx] ?? '';

  const nextPhrase = useCallback(() => {
    setPhraseIdx((prev) => (prev + 1) % phrases.length);
  }, [phrases.length]);

  useEffect(() => {
    if (!currentPhrase) return;

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

    // Typing
    if (displayed === currentPhrase) {
      setIsPaused(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(currentPhrase.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, isPaused, currentPhrase, speed, deleteSpeed, pauseAfter, nextPhrase]);

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

export default Typewriter;
