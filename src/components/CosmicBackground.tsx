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
          SAMPLES: isMobile ? 5 : 8,
          FOCAL_DISTANCE: 4,
          FOCAL_RANGE: 6,
          colorChangeSpeed: 1,
          brightness: 1.1,
        }}
        speed={1}
        minPixelRatio={isMobile ? 1 : 2}
        maxPixelCount={isMobile ? 960 * 540 : 1280 * 720}
      />
      <div className="cosmic-bleed" />
      <div className="cosmic-vignette" />
      <div className="cosmic-grain" />
    </div>
  );
}