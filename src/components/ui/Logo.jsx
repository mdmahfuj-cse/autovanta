import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';
import { PATHS } from '../../routes/paths.js';

/** The AutoVanta mark — an "A" formed as a road vanishing to the horizon. */
export function LogoMark({ className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn('h-9 w-9 shrink-0', className)}
    >
      <rect x="0.5" y="0.5" width="39" height="39" rx="9" fill="#101014" stroke="rgba(255,255,255,0.12)" />
      <path d="M20 8 L32.5 32 H26.4 L20 18.6 L13.6 32 H7.5 Z" fill="#B31217" />
      <path d="M15.8 24.4 H24.2 L26.1 28.2 H13.9 Z" fill="#F4F4F5" />
    </svg>
  );
}

export default function Logo({ withWordmark = true, className }) {
  return (
    <Link
      to={PATHS.home}
      className={cn('group flex items-center gap-2.5', className)}
      aria-label="AutoVanta — home"
    >
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          AUTO<span className="text-primary-text">VANTA</span>
        </span>
      )}
    </Link>
  );
}
