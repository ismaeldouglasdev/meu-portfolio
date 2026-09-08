import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '../hooks/useIsMobile';

function ParticleField({ count = 500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 1.2;
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
        color="#b8d8ff"
        size={0.032}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

const COMET_TRAIL_POINTS = 24;
const COMET_LIFETIME = 2.6;
const COMET_SPAWN_MIN = 6;
const COMET_SPAWN_MAX = 14;

function spawnComet(): { pos: THREE.Vector3; dir: THREE.Vector3; speed: number } {
  const fromLeft = Math.random() > 0.5;
  const dir = new THREE.Vector3(
    fromLeft ? 1 : -1,
    -(0.25 + Math.random() * 0.35),
    0,
  ).normalize();
  const startY = 1.2 + Math.random() * 1.6;
  const pos = new THREE.Vector3(
    fromLeft ? -4.5 : 4.5,
    startY,
    -1.5 + Math.random() * 2,
  );
  return { pos, dir, speed: 3 + Math.random() * 1.5 };
}

function Comets() {
  const cometsRef = useRef<THREE.Group>(null);
  const nextSpawnRef = useRef(3 + Math.random() * 4);
  const activeRef = useRef<
    Map<
      string,
      { comet: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>; age: number; life: number; dir: THREE.Vector3; speed: number }
    >
  >(new Map());

  const makeComet = useCallback(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COMET_TRAIL_POINTS * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const colors = new Float32Array(COMET_TRAIL_POINTS * 3);
    for (let i = 0; i < COMET_TRAIL_POINTS; i++) {
      const t = 1 - i / (COMET_TRAIL_POINTS - 1);
      colors[i * 3] = 0.5 + 0.35 * t;
      colors[i * 3 + 1] = 0.75 + 0.2 * t;
      colors[i * 3 + 2] = 1.0;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geo, mat);
  }, []);

  useFrame((state, delta) => {
    const group = cometsRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;

    if (t > nextSpawnRef.current) {
      nextSpawnRef.current = t + COMET_SPAWN_MIN + Math.random() * (COMET_SPAWN_MAX - COMET_SPAWN_MIN);
      const spawn = spawnComet();
      const comet = makeComet();
      comet.position.copy(spawn.pos);
      group.add(comet);
      activeRef.current.set(comet.uuid, {
        comet,
        age: 0,
        life: COMET_LIFETIME,
        dir: spawn.dir,
        speed: spawn.speed,
      });
    }

    for (const [uuid, entry] of activeRef.current) {
      entry.age += delta;
      const pos = entry.comet.position;
      pos.addScaledVector(entry.dir, entry.speed * delta);
      const positions = entry.comet.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = COMET_TRAIL_POINTS - 1; i > 0; i--) {
        positions.setXYZ(
          i,
          positions.getX(i - 1),
          positions.getY(i - 1),
          positions.getZ(i - 1),
        );
      }
      positions.setXYZ(0, pos.x, pos.y, pos.z);
      positions.needsUpdate = true;
      const fade = Math.min(entry.age * 2, 1) * Math.min((entry.life - entry.age) * 1.5, 1);
      entry.comet.material.opacity = 0.9 * Math.max(fade, 0);
      if (entry.age > entry.life || Math.abs(pos.x) > 6 || pos.y < -4) {
        group.remove(entry.comet);
        entry.comet.geometry.dispose();
        entry.comet.material.dispose();
        activeRef.current.delete(uuid);
      }
    }
  });

  useEffect(() => {
    const active = activeRef.current;
    return () => {
      active.forEach(({ comet }) => {
        comet.geometry.dispose();
        comet.material.dispose();
      });
      active.clear();
    };
  }, []);

  return <group ref={cometsRef} />;
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
        dpr={[1, 1.25]}
        gl={{ antialias: !isMobile, alpha: true }}
        frameloop={visible ? 'always' : 'never'}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ParticleField count={isMobile ? 180 : 500} />
        <Comets />
      </Canvas>
    </div>
  );
}
