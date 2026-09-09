/**
 * App Lifecycle Service
 * Automatically stops Sthang Studio / Khmer Captions SRT when all app windows are closed.
 */

const activeClients = new Map<string, number>();
let hasEverConnected = false;
let shutdownTimer: NodeJS.Timeout | null = null;
let reaperInterval: NodeJS.Timeout | null = null;

const DISCONNECT_GRACE_PERIOD_MS = 2_500; // 2.5 seconds to distinguish F5 reload from actual window close
const HEARTBEAT_TIMEOUT_MS = 7_000; // 7 seconds without heartbeat = dead client

export function recordHeartbeat(clientId?: string): void {
  const id = clientId && typeof clientId === 'string' ? clientId : 'default';
  activeClients.set(id, Date.now());
  hasEverConnected = true;

  if (shutdownTimer) {
    clearTimeout(shutdownTimer);
    shutdownTimer = null;
  }
}

export function recordDisconnect(clientId?: string): void {
  const id = clientId && typeof clientId === 'string' ? clientId : 'default';
  activeClients.delete(id);

  if (activeClients.size === 0 && hasEverConnected) {
    scheduleShutdown('Window close detected');
  }
}

function scheduleShutdown(reason: string): void {
  if (shutdownTimer) return;
  console.log(`[Lifecycle] ${reason}. Initiating shutdown in ${DISCONNECT_GRACE_PERIOD_MS / 1000}s...`);
  shutdownTimer = setTimeout(() => {
    if (activeClients.size === 0) {
      triggerShutdown(reason);
    }
  }, DISCONNECT_GRACE_PERIOD_MS);
}

export function triggerShutdown(reason: string): void {
  console.log(`[Lifecycle] Stopping Sthang Studio / Khmer Captions SRT (${reason})...`);
  process.exit(0);
}

export function initAppLifecycle(): void {
  if (process.env.NODE_ENV === 'test' || process.env.KCS_DISABLE_AUTO_SHUTDOWN === 'true') {
    return;
  }

  reaperInterval = setInterval(() => {
    const now = Date.now();
    for (const [id, lastSeen] of activeClients.entries()) {
      if (now - lastSeen > HEARTBEAT_TIMEOUT_MS) {
        activeClients.delete(id);
      }
    }

    if (hasEverConnected && activeClients.size === 0) {
      scheduleShutdown('App window closed or inactive');
    }
  }, 2_500);

  reaperInterval.unref?.();
}
