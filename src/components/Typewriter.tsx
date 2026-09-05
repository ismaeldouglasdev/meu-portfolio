import { useState, useEffect } from 'react';

interface Props {
  phrases: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseAfter?: number;
  className?: string;
}

interface TickStatus {
  phraseIdx: number;
  displayed: string;
  isDeleting: boolean;
  isPaused: boolean;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Progresso baseado em timestamp + requestAnimationFrame: imune a
// throttling de setTimeout (aba/background) e a reflows do grid.
function Typewriter({
  phrases,
  speed = 65,
  deleteSpeed = 35,
  pauseAfter = 2500,
  className = '',
}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [status, setStatus] = useState<TickStatus>({
    phraseIdx: 0,
    displayed: '',
    isDeleting: false,
    isPaused: false,
  });

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  let { phraseIdx, displayed, isDeleting, isPaused } = status;

  useEffect(() => {
    if (reducedMotion) {
      setStatus({
        phraseIdx: phrases.length - 1,
        displayed: phrases[phrases.length - 1] ?? '',
        isDeleting: false,
        isPaused: false,
      });
    }
  }, [reducedMotion, phrases]);

  useEffect(() => {
    if (reducedMotion || !phrases.length) return;

    let rafId = 0;
    let lastAt = performance.now();

    const step = (now: number) => {
      // Re-leitura do estado atual dentro do loop (evita closures obsoletos
      // e dependências extras que re-criavam o efeito a cada caractere).
      const p = phrases[phraseIdx] ?? '';

      if (isPaused) {
        if (now - lastAt >= pauseAfter) {
          lastAt = now;
          setStatus((s) => ({ ...s, isPaused: false, isDeleting: true }));
        }
      } else if (isDeleting) {
        if (displayed === '') {
          lastAt = now;
          setStatus((s) => ({
            phraseIdx: (s.phraseIdx + 1) % phrases.length,
            displayed: '',
            isDeleting: false,
            isPaused: false,
          }));
        } else if (now - lastAt >= deleteSpeed) {
          lastAt = now;
          const shorter = displayed.slice(0, displayed.length - 1);
          setStatus((s) => ({ ...s, displayed: shorter }));
        }
      } else {
        if (displayed === p) {
          lastAt = now;
          setStatus((s) => ({ ...s, isPaused: true }));
        } else if (now - lastAt >= speed) {
          lastAt = now;
          const longer = p.slice(0, displayed.length + 1);
          setStatus((s) => ({ ...s, displayed: longer }));
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [phraseIdx, isDeleting, isPaused, displayed, phrases.length, reducedMotion, speed, deleteSpeed, pauseAfter]);

  if (reducedMotion) {
    return (
      <span className={className}>
        {phrases.map((phrase) => (
          <span className="typewriter-spacer" aria-hidden="true" key={phrase}>
            {phrase}
          </span>
        ))}
        <span className="typewriter-text">
          {phrases[phrases.length - 1] ?? ''}
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      {phrases.map((phrase) => (
        <span className="typewriter-spacer" aria-hidden="true" key={phrase}>
          {phrase}
        </span>
      ))}
      <span className="typewriter-text">
        {displayed || ''}
        <span className="typewriter-cursor" aria-hidden="true">|</span>
      </span>
    </span>
  );
}

export default Typewriter;
