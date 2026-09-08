import { useState } from 'react';

/**
 * Detects Firefox browser via UA string.
 * Used to skip heavy WebGL shaders (e.g. ColorPanels) on Firefox mobile,
 * which is noticeably slower at WebGL shader compilation/rendering than Chrome.
 */
export function useIsFirefox(): boolean {
  const [isFirefox] = useState<boolean>(() => {
    if (typeof navigator === 'undefined') return false;
    return /Firefox\//.test(navigator.userAgent) && !/Seamonkey\//.test(navigator.userAgent);
  });

  return isFirefox;
}