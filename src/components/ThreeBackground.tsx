import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as THREE from 'three';

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
  return (
    <div className="three-bg" aria-hidden="true">
      {/* Gradiente animado de fundo (shadergradient) */}
      <ShaderGradientCanvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
          <ShaderGradient
            control="props"
            type="waterPlane"
            color1="#1e293b"
            color2="#334155"
            color3="#64748b"
            animate="on"
            uSpeed={0.25}
            uDensity={1.2}
            uStrength={0.6}
          />
      </ShaderGradientCanvas>

      {/* Partículas 3D por cima */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
