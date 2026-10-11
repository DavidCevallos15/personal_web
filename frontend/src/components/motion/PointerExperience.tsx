import { lazy, Suspense } from 'react';
import { useInteractionMode } from '@/lib/interaction';

const Cursor = lazy(() => import('./SmartCursor'));
export function PointerExperience() {
  const { fine, reduced } = useInteractionMode();
  return fine && !reduced ? <Suspense fallback={null}><Cursor /></Suspense> : null;
}
