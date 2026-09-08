interface ShapeProps {
  className?: string;
  size?: number;
}

// Sparkle de 4 pontas com bordas côncavas (outline) — estética Y2K do pack baixado.
export function Sparkle({ className, size = 24 }: ShapeProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C13.2 8.4 15.6 10.8 22 12C15.6 13.2 13.2 15.6 12 22C10.8 15.6 8.4 13.2 2 12C8.4 10.8 10.8 8.4 12 2Z" />
    </svg>
  );
}

// Globo wireframe (meridianos + paralelos) — decoração de fundo das seções.
export function WireGlobe({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.7}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="42" />
      <ellipse cx="50" cy="50" rx="42" ry="16" />
      <ellipse cx="50" cy="50" rx="16" ry="42" />
      <ellipse cx="50" cy="50" rx="42" ry="28" transform="rotate(60 50 50)" />
      <line x1="50" y1="8" x2="50" y2="92" />
      <line x1="8" y1="50" x2="92" y2="50" />
    </svg>
  );
}

// Swoosh Y2K de velocidade — 3 traços curvos convergentes.
export function Swoosh({ className, size = 48 }: ShapeProps) {
  return (
    <svg
      className={className}
      width={size}
      height={Math.round(size * 0.7)}
      viewBox="0 0 60 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 34C24 28 44 14 58 3" />
      <path d="M16 40C32 34 48 22 60 10" />
      <path d="M2 40C14 38 28 32 40 26" />
    </svg>
  );
}