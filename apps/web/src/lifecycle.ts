/**
 * Web App Lifecycle
 * Sends periodic heartbeats and signals disconnect when the browser window is closed.
 */

const CLIENT_ID = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;

let initialized = false;

export function initAppLifecycle(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const sendHeartbeat = () => {
    try {
      fetch('/api/system/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: CLIENT_ID }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  const sendDisconnect = () => {
    try {
      const payload = JSON.stringify({ clientId: CLIENT_ID });
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/system/disconnect', blob);
      } else {
        fetch('/api/system/disconnect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  };

  // Initial heartbeat
  sendHeartbeat();

  // Periodic heartbeat every 2.5 seconds
  window.setInterval(sendHeartbeat, 2500);

  // When window is closed (or navigated away), notify the backend immediately
  window.addEventListener('pagehide', sendDisconnect);
  window.addEventListener('beforeunload', sendDisconnect);
}
