import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2,
  Calculator,
  ChevronRight,
  Heart,
  Home,
  Info,
  Mail,
  Newspaper,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { PATHS } from '../../routes/paths.js';
import { cn } from '../../utils/cn.js';
import { useUiStore } from '../../stores/uiStore.js';
import { useWishlistStore } from '../../stores/wishlistStore.js';

const SPRING = { type: 'spring', stiffness: 320, damping: 34 };

/**
 * QuickNav — secondary quick-access panel (slide-over from the left).
 * On mobile it *is* the navigation drawer; on desktop it's a fast launcher.
 */
export default function QuickNav() {
  const open = useUiStore((s) => s.quickNavOpen);
  const setOpen = useUiStore((s) => s.setQuickNavOpen);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Focus management, Esc, focus trap, scroll lock
  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [open, setOpen]);

  const groups = [
    {
      title: 'Menu',
      items: [
        { label: 'Home', to: PATHS.home, match: PATHS.home, exact: true, icon: Home },
        { label: 'Brands', to: PATHS.brands, match: PATHS.brands, icon: Building2 },
        { label: 'Journal', to: PATHS.journal, match: PATHS.journal, icon: Newspaper },
        { label: 'About', to: PATHS.about, match: PATHS.about, icon: Info },
        { label: 'Contact', to: PATHS.contact, match: PATHS.contact, icon: Mail },
      ],
    },
    {
      title: 'Browse',
      items: [
        { label: 'Featured Cars', to: `${PATHS.cars}?flag=featured`, match: PATHS.cars, icon: Sparkles },
        { label: 'New Arrivals', to: `${PATHS.cars}?flag=newArrival`, match: PATHS.cars, icon: Zap },
        { label: 'Wishlist', to: PATHS.wishlist, match: PATHS.wishlist, icon: Heart, count: wishlistCount },
      ],
    },
    {
      title: 'Experience',
      items: [
        { label: 'Finance Calculator', to: PATHS.finance, match: PATHS.finance, icon: Calculator },
        { label: 'Services', to: PATHS.services, match: PATHS.services, icon: Wrench },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.aside
            id="quick-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            className="fixed inset-y-0 left-0 z-[80] flex w-[min(88vw,360px)] flex-col border-r border-white/10 bg-base-200 shadow-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={SPRING}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Logo />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Close quick navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-6" aria-label="Quick navigation">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 pb-2 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    {group.title}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = item.exact
                        ? pathname === item.match
                        : pathname.startsWith(item.match);
                      return (
                        <li key={item.label}>
                          <Link
                            to={item.to}
                            className={cn(
                              'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                              active
                                ? 'bg-primary/10 text-base-content'
                                : 'text-muted hover:bg-white/5 hover:text-base-content'
                            )}
                          >
                            <item.icon
                              className={cn('h-4 w-4 shrink-0', active ? 'text-primary-text' : '')}
                              aria-hidden="true"
                            />
                            <span className="flex-1 font-medium">{item.label}</span>
                            {item.count > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[11px] font-semibold text-white">
                                {item.count}
                              </span>
                            )}
                            <ChevronRight
                              className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-50"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="border-t border-white/10 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                Flagship showroom
              </p>
              <p className="mt-1 text-sm font-medium">AutoVanta GEC, Chattogram</p>
              <a
                href="tel:+8801812345678"
                className="font-mono text-sm text-primary-text transition-opacity hover:opacity-80"
              >
                +880 18 1234 5678
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
