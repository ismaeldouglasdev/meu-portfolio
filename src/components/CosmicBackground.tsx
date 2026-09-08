import { useState } from 'react';
import CosmicVideo from './CosmicVideo';

export default function CosmicBackground() {
  const [ready, setReady] = useState(false);

  return (
    <div aria-hidden="true" data-cosmic-layer="true">
      <div className={`cosmic-bg${ready ? ' is-ready' : ''}`}>
        <CosmicVideo onReady={() => setReady(true)} />
      </div>
      <div className="cosmic-vignette" />
      <div className="cosmic-grain" />
    </div>
  );
}