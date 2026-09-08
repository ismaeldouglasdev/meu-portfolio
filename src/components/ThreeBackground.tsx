import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

// Campo de partículas 3D flutuantes que reage suavemente ao mouse.
function ParticleField({ count = 700 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.004;
    points.current.rotation.x = Math.sin(t * 0.015) * 0.012;
    const { x, y } = state.pointer;
    points.current.rotation.y += x * 0.003;
    points.current.rotation.x += y * 0.003;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  const [visible, setVisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = document.querySelector('.three-bg');
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="three-bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
        frameloop={visible ? 'always' : 'never'}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ParticleField count={isMobile ? 250 : 700} />
      </Canvas>
    </div>
  );
}