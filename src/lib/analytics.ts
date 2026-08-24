const ANALYTICS_ENDPOINT = 'https://blog-analytics.y2kgif.workers.dev/api/events';

function getDomain(): string {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'localhost';
  return hostname;
}

export function track(eventType: string, path: string, meta?: Record<string, string>): void {
  try {
    const payload = {
      event_type: eventType,
      domain: getDomain(),
      path,
      referrer: document.referrer || undefined,
      meta: meta ? JSON.stringify(meta) : undefined,
    };

    // text/plain keeps this a CORS-simple request — sendBeacon cannot preflight,
    // so application/json would be silently blocked by the browser.
    const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });

    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
    } else {
      fetch(ANALYTICS_ENDPOINT, { method: 'POST', body: blob, keepalive: true }).catch(() => {});
    }
  } catch {
    // analytics must never break the page
  }
}
