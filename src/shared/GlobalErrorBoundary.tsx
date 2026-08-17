import React, { useEffect, useState } from 'react';

export const GlobalErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const error = 'reason' in event ? event.reason : event.error || new Error(event.message);
      if (!hasError) {
        console.error('[GLOBAL ERROR]', error);
        setHasError(true);
        
        const root = document.getElementById('root');
        if (root) {
          const fallback = document.createElement('div');
          fallback.id = 'global-error-fallback';
          fallback.style.cssText = `
            position:fixed;top:0;left:0;right:0;bottom:0;
            background:#121212;z-index:9999;
            color:#fff;padding:4rem;display:flex;
            align-items:center;justify-content:center;
            text-align:center;font-family:system-ui;
          `;
          fallback.textContent = '💥 Aplicação crítica falhou. Recarregando em 3s...';
          root.appendChild(fallback);
          
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [hasError]);
  
  return hasError ? null : <React.Fragment />;
};