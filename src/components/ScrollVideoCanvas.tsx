import { useEffect, useRef, type CSSProperties } from 'react';

interface ScrollVideoCanvasProps {
  /** Diretório público com subpastas desktop/ e mobile/ contendo os quadros. */
  baseDir: string;
  frameCount: number;
  lerpFactor?: number;
  dprCap?: number;
  className?: string;
  style?: CSSProperties;
  /** Chamado quando o primeiro quadro é decodificado (para o fade-in). */
  onReady?: () => void;
}

export default function ScrollVideoCanvas({
  baseDir,
  frameCount,
  lerpFactor = 0.12,
  dprCap = 1.5,
  className,
  style,
  onReady,
}: ScrollVideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mobileSet = window.matchMedia('(max-width: 767px)').matches;
    const capDpr = mobileSet ? 2 : dprCap;
    let dpr = Math.min(window.devicePixelRatio || 1, capDpr);
    const size = { w: canvas.clientWidth, h: canvas.clientHeight };
    canvas.width = Math.max(1, Math.round(size.w * dpr));
    canvas.height = Math.max(1, Math.round(size.h * dpr));

    const frames: Array<ImageBitmap | HTMLImageElement | null> = new Array(frameCount).fill(null);
    const pending = new Set<number>();
    for (let i = 0; i < frameCount; i++) pending.add(i);

    const MAX_CACHE = mobileSet ? 28 : 22;
    let currentFrame = 0;
    let rafId = 0;
    let notified = false;
    let disposed = false;
    let visible = true;
    const FRAME_INTERVAL = mobileSet ? 33 : 16;
    let lastTick = 0;

    const base = `${baseDir.replace(/\/+$/, '')}/${mobileSet ? 'mobile' : 'desktop'}`;
    const framePath = (i: number) => `${base}/frame-${String(i + 1).padStart(4, '0')}.webp`;

    const frameWidth = (img: ImageBitmap | HTMLImageElement) =>
      img instanceof ImageBitmap ? img.width : img.naturalWidth;
    const frameHeight = (img: ImageBitmap | HTMLImageElement) =>
      img instanceof ImageBitmap ? img.height : img.naturalHeight;

    const decode = async (i: number): Promise<ImageBitmap | HTMLImageElement | null> => {
      try {
        if ('createImageBitmap' in window) {
          const res = await fetch(framePath(i), { cache: 'force-cache' });
          if (!res.ok) return null;
          const blob = await res.blob();
          return await createImageBitmap(blob);
        }
        return await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('img load'));
          img.src = framePath(i);
        });
      } catch {
        return null;
      }
    };

    const evictFarFrom = (index: number) => {
      let count = 0;
      for (let i = 0; i < frameCount; i++) if (frames[i]) count++;
      while (count > MAX_CACHE) {
        let victim = -1;
        let worstDist = -1;
        for (let i = 0; i < frameCount; i++) {
          if (!frames[i]) continue;
          const dist = Math.abs(i - index);
          if (dist > worstDist) {
            worstDist = dist;
            victim = i;
          }
        }
        if (victim < 0) break;
        frames[victim] = null;
        count--;
      }
    };

    const pump = async () => {
      while (pending.size > 0 && !disposed) {
        if (!visible) {
          await new Promise((r) => setTimeout(r, 250));
          continue;
        }
        let next = -1;
        let nextDist = Infinity;
        for (const i of pending) {
          const dist = Math.abs(i - Math.round(currentFrame));
          if (dist < nextDist) {
            nextDist = dist;
            next = i;
          }
        }
        if (next < 0) return;
        pending.delete(next);
        const img = await decode(next);
        if (disposed || !img) continue;
        frames[next] = img;
        evictFarFrom(Math.round(currentFrame));
        if (!notified) {
          notified = true;
          onReadyRef.current?.();
        }
      }
    };

    const nearestLoaded = (index: number): ImageBitmap | HTMLImageElement | null => {
      let nearest = -1;
      let nearestDist = Infinity;
      for (let i = 0; i < frameCount; i++) {
        if (!frames[i]) continue;
        const dist = Math.abs(i - index);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      }
      return nearest >= 0 ? frames[nearest] : null;
    };

    const drawFrame = (index: number) => {
      const target = Math.max(0, Math.min(frameCount - 1, Math.round(index)));
      const img = frames[target] ?? nearestLoaded(target);
      if (!img) return;
      const iw = frameWidth(img);
      const ih = frameHeight(img);
      const scale = Math.max(size.w / iw, size.h / ih);
      const dw = iw * scale * dpr;
      const dh = ih * scale * dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    };

    const rawProgress = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / rect.height));
    };

    const tick = (ts: number) => {
      if (disposed) return;
      if (ts - lastTick >= FRAME_INTERVAL) {
        lastTick = ts;
        currentFrame += (rawProgress() * (frameCount - 1) - currentFrame) * lerpFactor;
        drawFrame(currentFrame);
      }
      rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, mobileSet ? 2 : capDpr);
      size.w = canvas.clientWidth;
      size.h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(size.w * dpr));
      canvas.height = Math.max(1, Math.round(size.h * dpr));
      drawFrame(currentFrame);
    };

    window.addEventListener('resize', onResize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      void pump().then(() => {
        if (disposed) return;
        currentFrame = rawProgress() * (frameCount - 1);
        drawFrame(currentFrame);
      });
    } else {
      rafId = requestAnimationFrame(tick);
      void pump();
    }

    // Pausa o rAF fora da viewport (performance no scroll).
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !disposed && !reduceMotion && !rafId) {
          rafId = requestAnimationFrame(tick);
        } else if (!visible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [baseDir, frameCount, dprCap, lerpFactor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    />
  );
}