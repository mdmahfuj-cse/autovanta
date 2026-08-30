import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Search, X } from 'lucide-react';
import { PATHS } from '../../routes/paths.js';
import { CARS } from '../../data/index.js';
import { applyFilters } from '../../utils/carFilters.js';
import { useUiStore } from '../../stores/uiStore.js';
import { EASE_OUT_EXPO } from '../shared/motionTokens.js';

const SUGGESTIONS = ['SUV', 'Electric', 'BMW', 'Porsche', 'Automatic', 'Under 1 Crore'];

/**
 * The dialog (backdrop + sheet + form). Rendered only while open, so its
 * query state resets naturally on unmount — no effect-side state syncing.
 */
function SearchDialog({ onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const goToCatalogue = (q) => {
    onClose();
    navigate(q ? `${PATHS.cars}?q=${encodeURIComponent(q)}` : PATHS.cars);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goToCatalogue(query.trim());
  };

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Search AutoVanta">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        className="relative border-b border-white/10 bg-base-200/95 shadow-2xl backdrop-blur-xl"
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      >
        <div className="container-x py-6 md:py-8">
          <form onSubmit={onSubmit} role="search" className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Search className="h-6 w-6 shrink-0 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the showroom — models, brands, categories…"
              aria-label="Search query"
              className="w-full bg-transparent text-lg text-base-content outline-none placeholder:text-muted md:text-2xl"
            />
            <kbd className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted md:block">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-square btn-sm"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-eyebrow mr-1 text-muted">Try</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => goToCatalogue(s)}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-base-content"
              >
                {s}
              </button>
            ))}
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-muted" aria-live="polite">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            {query.trim()
              ? `${applyFilters(CARS, { q: query }).length} vehicles match — press Enter to view them`
              : `${CARS.length} vehicles in the garage — type to narrow them down`}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SearchOverlay() {
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);

  // Lock body scroll while the overlay is mounted.
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return <AnimatePresence>{open && <SearchDialog onClose={() => setOpen(false)} />}</AnimatePresence>;
}
