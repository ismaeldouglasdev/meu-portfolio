import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GradientOrb({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float alpha = smoothstep(0.5, 0.0, dist) * 0.12;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    }),
    [color]
  );

  useFrame((state) => {
    if (!mesh.current || !material.current) return;
    const time = state.clock.getElapsedTime();
    material.current.uniforms.uTime.value = time;
    mesh.current.position.x = position[0] + Math.sin(time * 0.08) * 0.4;
    mesh.current.position.y = position[1] + Math.cos(time * 0.12) * 0.25;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <planeGeometry args={[4, 4]} />
      <shaderMaterial
        ref={material}
        args={[shader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="three-bg">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GradientOrb position={[-2, 1, 0]} color="#1a1a2e" scale={2} />
        <GradientOrb position={[2, -1, 0]} color="#16213e" scale={1.8} />
        <GradientOrb position={[0, 0, 0]} color="#0f3460" scale={1.5} />
      </Canvas>
    </div>
  );
}
