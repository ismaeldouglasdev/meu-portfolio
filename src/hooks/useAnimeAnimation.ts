import { useEffect, useRef, RefObject } from 'react';
import anime from 'animejs';

interface AnimationOptions {
  delay?: number;
  duration?: number;
  easing?: string;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: AnimationOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: el,
              opacity: [0, 1],
              translateY: [40, 0],
              duration: options.duration || 800,
              delay: options.delay || 0,
              easing: options.easing || 'easeOutCubic',
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    el.style.opacity = '0';
    observer.observe(el);

    return () => observer.disconnect();
  }, [options.delay, options.duration, options.easing]);

  return ref;
}

export function useStaggerAnimation<T extends HTMLElement>(
  selector: string,
  options: AnimationOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = el.querySelectorAll(selector);
            anime({
              targets: children,
              opacity: [0, 1],
              translateY: [30, 0],
              duration: options.duration || 600,
              delay: anime.stagger(100, { start: options.delay || 0 }),
              easing: options.easing || 'easeOutCubic',
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    el.style.opacity = '1';
    observer.observe(el);

    return () => observer.disconnect();
  }, [selector, options.delay, options.duration, options.easing]);

  return ref;
}

export function useCountUp(
  target: number,
  options: AnimationOptions = {}
): RefObject<HTMLSpanElement | null> {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const obj = { value: 0 };
            anime({
              targets: obj,
              value: target,
              duration: options.duration || 1500,
              delay: options.delay || 0,
              easing: options.easing || 'easeOutCubic',
              update: () => {
                el.textContent = String(Math.round(obj.value));
              },
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target, options.delay, options.duration, options.easing]);

  return ref;
}
