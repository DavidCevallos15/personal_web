import { useSyncExternalStore } from 'react';

const queries = ['(pointer: fine)', '(prefers-reduced-motion: reduce)'];
function subscribe(callback: () => void) {
  const media = queries.map((query) => window.matchMedia(query));
  media.forEach((query) => query.addEventListener('change', callback));
  return () => media.forEach((query) => query.removeEventListener('change', callback));
}
function snapshot() {
  return (window.matchMedia(queries[0]).matches ? 1 : 0) | (window.matchMedia(queries[1]).matches ? 2 : 0);
}
export function useInteractionMode() {
  const mode = useSyncExternalStore(subscribe, snapshot, () => 2);
  return { fine: !!(mode & 1), reduced: !!(mode & 2) };
}
