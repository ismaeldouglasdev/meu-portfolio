import { GrainGradient } from '@paper-design/shaders-react';

export default function CosmicBackground() {
  return (
    <div aria-hidden="true" data-cosmic-layer="true">
      <div className="cosmic-bg is-ready">
        <GrainGradient
          width={1280}
          height={720}
          colors={['#7300ff', '#eba8ff', '#00bfff', '#2b00ff']}
          colorBack="#000000"
          softness={0.5}
          intensity={0.5}
          noise={0.25}
          shape="corners"
          speed={1}
          fit="cover"
          minPixelRatio={2}
        />
      </div>
      <div className="cosmic-vignette" />
      <div className="cosmic-grain" />
    </div>
  );
}