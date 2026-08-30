import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import QuickNav from '../components/layout/QuickNav.jsx';
import SearchOverlay from '../components/layout/SearchOverlay.jsx';
import Footer from '../components/layout/Footer.jsx';
import ToastViewport from '../components/layout/ToastViewport.jsx';
import BackToTop from '../components/layout/BackToTop.jsx';
import ScrollAndFocusManager from '../components/layout/ScrollAndFocusManager.jsx';
import CompareTray from '../features/compare/CompareTray.jsx';
import { useUiStore } from '../stores/uiStore.js';

export default function RootLayout({ children }) {
  // ⌘K / Ctrl+K toggles the search overlay from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const ui = useUiStore.getState();
        ui.setSearchOpen(!ui.searchOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-base-100 text-base-content">
      <a
        href="#main-content"
        className="btn btn-primary btn-sm sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100]"
      >
        Skip to content
      </a>

      <Navbar />
      <QuickNav />
      <SearchOverlay />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <Footer />
      <ToastViewport />
      <BackToTop />
      <CompareTray />
      <ScrollAndFocusManager />
    </div>
  );
}
