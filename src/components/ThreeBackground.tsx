import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Campo de partículas 3D flutuantes que reage suavemente ao mouse.
// Renderizado atrás do conteúdo do Hero (position absolute, z-index 0).
function ParticleField({ count = 900 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  // Posições aleatórias numa esfera/cubo
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribuição esférica com raio variável
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
    // rotação lenta contínua
    points.current.rotation.y = t * 0.04;
    points.current.rotation.x = Math.sin(t * 0.1) * 0.08;
    // leve parallax com o mouse
    const { x, y } = state.pointer;
    points.current.rotation.y += x * 0.02;
    points.current.rotation.x += y * 0.02;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="three-bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
