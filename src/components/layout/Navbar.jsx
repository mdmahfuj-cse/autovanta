import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Menu, Scale, Search, UserRound, KeyRound, Calculator } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { PATHS } from '../../routes/paths.js';
import { cn } from '../../utils/cn.js';
import { useScrolled } from '../../hooks/useScrollPosition.js';
import { useUiStore } from '../../stores/uiStore.js';
import { useWishlistStore } from '../../stores/wishlistStore.js';
import { useCompareStore } from '../../stores/compareStore.js';

/**
 * The three primary actions — centred in the navbar between the logo
 * (left) and the search button (right). `short` is used on tiny screens.
 * Everything else lives in the QuickNav drawer.
 */
const CENTER_LINKS = [
  { to: PATHS.cars, label: 'Explore Cars', short: 'Cars' },
  { to: PATHS.compare, label: 'Compare Garage', short: 'Compare', badge: 'compare' },
  { to: PATHS.testDrive, label: 'Book a Test Drive', short: 'Test Drive' },
];

function CountBadge({ count, className }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
      className={cn(
        'flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold leading-none text-white',
        className
      )}
    >
      {count}
    </motion.span>
  );
}

export default function Navbar() {
  const scrolled = useScrolled(12);
  const setQuickNavOpen = useUiStore((s) => s.setQuickNavOpen);
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);

  const pill = ({ isActive }) =>
    cn(
      'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors',
      'px-3 py-2 text-sm md:px-3.5',
      isActive ? 'bg-white/8 text-base-content' : 'text-muted hover:bg-white/5 hover:text-base-content'
    );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-white/10 bg-base-100/85 backdrop-blur-xl'
          : 'border-transparent bg-gradient-to-b from-base-100/90 to-transparent'
      )}
    >
      <nav aria-label="Primary">
        <div className="relative container-x flex h-16 items-center gap-1.5 lg:h-18">
          {/* Quick-nav launcher — pinned top-left on every viewport */}
          <button
            type="button"
            onClick={() => setQuickNavOpen(true)}
            className="btn btn-ghost btn-square btn-sm sm:btn-md -ml-2 shrink-0"
            aria-label="Open quick navigation"
            aria-controls="quick-nav"
            aria-expanded="false"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo />

          {/* The three primary actions — true centre of the bar */}
          <div className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {CENTER_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={pill}>
                {link.label}
                {link.badge === 'compare' && <CountBadge count={compareCount} />}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost btn-square btn-sm sm:btn-md"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to={PATHS.wishlist}
              className="btn btn-ghost btn-square btn-sm relative sm:btn-md"
              aria-label={`Wishlist — ${wishlistCount} saved`}
            >
              <Heart className="h-5 w-5" />
              <CountBadge count={wishlistCount} className="-right-0.5 -top-0.5 absolute" />
            </Link>

            {/* Account dropdown (desktop) */}
            <div className="dropdown dropdown-end hidden lg:block">
              <button type="button" className="btn btn-ghost btn-square btn-md" aria-label="Account menu">
                <UserRound className="h-5 w-5" />
              </button>
              <ul className="dropdown-content menu z-50 mt-2 w-60 rounded-box border border-white/10 bg-base-200 p-2 shadow-2xl">
                <li className="menu-title text-[10px] uppercase tracking-[0.2em] text-muted">My garage</li>
                <li>
                  <Link to={PATHS.wishlist}>
                    <Heart className="h-4 w-4" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto font-mono text-xs text-muted">{wishlistCount}</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link to={PATHS.compare}>
                    <Scale className="h-4 w-4" /> Compare
                    {compareCount > 0 && (
                      <span className="ml-auto font-mono text-xs text-muted">{compareCount}</span>
                    )}
                  </Link>
                </li>
                <li className="menu-title mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">Tools</li>
                <li>
                  <Link to={PATHS.testDrive}>
                    <KeyRound className="h-4 w-4" /> Test Drive
                  </Link>
                </li>
                <li>
                  <Link to={PATHS.finance}>
                    <Calculator className="h-4 w-4" /> Finance Calculator
                  </Link>
                </li>
                <li className="menu-title mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">Account</li>
                <li>
                  <button type="button" disabled className="opacity-50">
                    Dealer sign-in <span className="badge badge-xs badge-primary">Soon</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Small screens: the same three actions as a scrollable rail
            directly under the bar (full labels from sm up) */}
        <div className="border-t border-white/5 md:hidden">
          <div className="container-x overflow-x-auto no-scrollbar">
            <div className="flex w-max items-center gap-0.5 pb-1.5 pt-1">
              {CENTER_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={pill}>
                  <span className="sm:hidden">{link.short}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                  {link.badge === 'compare' && <CountBadge count={compareCount} />}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
