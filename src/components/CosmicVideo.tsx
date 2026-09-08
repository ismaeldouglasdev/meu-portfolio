import { useEffect, useRef, type CSSProperties } from 'react';

interface CosmicVideoProps {
  className?: string;
  style?: CSSProperties;
  /** Chamado quando o primeiro frame é decodificado (fade-in). */
  onReady?: () => void;
}

/**
 * Fundo cósmico do hero usando <video> nativo com scroll-scrub.
 *
 * Por que vídeo: decode por hardware (suave no mobile) + escala por CSS (nítido em
 * qualquer DPR) + 1 elemento (baixo consumo) — substitui o ScrollVideoCanvas de 120
 * ImageBitmaps que travava e pixelava no celular.
 */
export default function CosmicVideo({ className, style, onReady }: CosmicVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mobileSet = window.matchMedia('(max-width: 767px)').matches;
    video.src = `${import.meta.env.BASE_URL || '/'}${mobileSet ? 'cosmos-mobile.mp4' : 'cosmos-desktop.mp4'}`;

    let rafId = 0;
    let visible = true;
    let duration = 0;
    let readyNotified = false;
    let disposed = false;

    const rawProgress = () => {
      const rect = video.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      return Math.max(0, Math.min(1, -rect.top / rect.height));
    };

    const scrub = () => {
      if (!duration) return;
      const target = rawProgress() * duration;
      video.currentTime = Math.min(Math.max(0, target), duration - 0.05);
    };

    const loop = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);
      if (visible) scrub();
    };

    const onLoadedMetadata = () => {
      duration = video.duration;
      // Frame inicial (topo do hero) já mostrado para o fade-in.
      video.currentTime = 0.05;
      if (!readyNotified) { readyNotified = true; onReadyRef.current?.(); }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.load();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) { video.play().catch(() => {}); rafId = requestAnimationFrame(loop); }
        else { video.pause(); cancelAnimationFrame(rafId); }
      },
      { rootMargin: '120px' },
    );
    io.observe(video);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', ...style }}
      muted
      playsInline
      loop
      preload="auto"
      aria-hidden="true"
    />
  );
}