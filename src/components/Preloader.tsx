import { useState, useEffect } from 'react';
import anime from 'animejs';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const obj = { value: 0 };
    anime({
      targets: obj,
      value: 100,
      duration: 2000,
      easing: 'easeInOutQuad',
      update: () => {
        setProgress(Math.round(obj.value));
      },
      complete: () => {
        anime({
          targets: '.preloader',
          opacity: 0,
          duration: 500,
          easing: 'easeOutCubic',
          complete: () => {
            setIsVisible(false);
            onComplete();
          },
        });
      },
    });
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-number">{progress}</div>
        <div className="preloader-line">
          <div className="preloader-line-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
