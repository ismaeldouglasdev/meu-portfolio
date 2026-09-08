import { ShaderMount } from '@paper-design/shaders-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { etherFragmentShader } from '../shaders/ether';

export default function CosmicBackground() {
  const isMobile = useIsMobile();

  return (
    <div aria-hidden="true" data-cosmic-layer="true">
      <ShaderMount
        className="cosmic-bg is-ready"
        fragmentShader={etherFragmentShader}
        uniforms={{
          SAMPLES: isMobile ? 4 : 6,
          FOCAL_DISTANCE: 4,
          FOCAL_RANGE: 6,
          colorChangeSpeed: 0.2,
          brightness: 0.4,
        }}
        speed={0.45}
        minPixelRatio={isMobile ? 1 : 2}
        maxPixelCount={isMobile ? 800 * 450 : 1024 * 576}
      />
      <div className="cosmic-bleed" />
      <div className="cosmic-vignette" />
      <div className="cosmic-grain" />
    </div>
  );
}