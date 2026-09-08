import { GrainGradient } from '@paper-design/shaders-react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function CosmicBackground() {
  const isMobile = useIsMobile();

  return (
    <div aria-hidden="true" data-cosmic-layer="true">
      <div className="cosmic-bg is-ready">
        <GrainGradient
          width={1280}
          height={720}
          colors={['#3b82f6', '#22d3ee', '#34d399']}
          colorBack="#000000"
          softness={isMobile ? 0.8 : 0.6}
          intensity={isMobile ? 0.25 : 0.35}
          noise={0.15}
          shape="corners"
          speed={1}
          fit="cover"
          minPixelRatio={isMobile ? 1 : 2}
          maxPixelCount={isMobile ? 960 * 540 : 1280 * 720}
        />
      </div>
      <div className="cosmic-bleed" />
      <div className="cosmic-vignette" />
      <div className="cosmic-grain" />
    </div>
  );
}