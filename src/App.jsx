import { Suspense } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import ErrorBoundary from './components/layout/ErrorBoundary.jsx';
import RouteLoader from './components/layout/RouteLoader.jsx';
import RootLayout from './layouts/RootLayout.jsx';
import AppRoutes from './routes/routes.jsx';

/**
 * Keyed Suspense wrapper gives every route change:
 * exit animation (old page) → chunk load fallback (RouteLoader) → enter animation.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense key={location.pathname} fallback={<RouteLoader />}>
        <AppRoutes />
      </Suspense>
    </AnimatePresence>
  );
}

/** Inner shell — exported for SSR smoke tests; the real app uses BrowserRouter. */
export function AppShell() {
  return (
    <ErrorBoundary>
      {/* Global reduced-motion honor: Motion degrades transform/layout
          animations to opacity for users who opt out at the OS level. */}
      <MotionConfig reducedMotion="user">
        <RootLayout>
          <AnimatedRoutes />
        </RootLayout>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
