/**
 * Placeholder analytics. Every event is logged to the console today.
 * To add real click tracking later, forward `payload` to your endpoint here
 * (for example with navigator.sendBeacon). Nothing is sent over the network now.
 */
const SRC_KEY = "booster:src";

export function getSource(): string | null {
  if (typeof window === "undefined") return null;
  const fromUrl = new URLSearchParams(window.location.search).get("src");
  try {
    if (fromUrl) window.sessionStorage.setItem(SRC_KEY, fromUrl);
    return fromUrl ?? window.sessionStorage.getItem(SRC_KEY);
  } catch {
    return fromUrl;
  }
}

export function track(event: string, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    src: getSource(),
    path: window.location.pathname,
    ts: new Date().toISOString(),
    ...props,
  };
  console.info("[booster:track]", payload);
}
