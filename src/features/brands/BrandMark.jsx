import { cn } from '../../utils/cn.js';
import { BRAND_LOGOS } from '../../assets/brandLogos.js';

/**
 * Brand mark — the real manufacturer logo rendered as a monochrome
 * 24x24 vector inside the racing-plate tile. Falls back to the
 * 3-letter plate code if a logo is missing from BRAND_LOGOS.
 * Marks inherit currentColor and stay aria-hidden (the surrounding
 * link/text carries the brand name).
 */
export default function BrandMark({ brand, size = 'md', className }) {
  const logo = BRAND_LOGOS[brand.id];

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex select-none items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-white/[0.03] text-base-content/90',
        size === 'sm' && 'h-11 w-14',
        size === 'md' && 'h-14 w-[4.5rem]',
        size === 'lg' && 'h-20 w-24',
        className
      )}
    >
      {logo ? (
        logo.d ? (
          <svg
            viewBox="0 0 24 24"
            focusable="false"
            className={cn(
              'transition-transform duration-300 group-hover:scale-105',
              size === 'sm' && 'h-5 w-5',
              size === 'md' && 'h-7 w-7',
              size === 'lg' && 'h-10 w-10'
            )}
          >
            <path d={logo.d} fill="currentColor" fillRule="evenodd" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            focusable="false"
            className={cn(
              'transition-transform duration-300 group-hover:scale-105',
              size === 'sm' && 'h-5 w-5',
              size === 'md' && 'h-7 w-7',
              size === 'lg' && 'h-10 w-10'
            )}
          >
            <g stroke="currentColor" strokeWidth={logo.strokeWidth ?? 1.4}>
              {logo.stroke.map(({ tag, props }, i) => {
                const Tag = tag;
                return <Tag key={i} {...props} />;
              })}
            </g>
          </svg>
        )
      ) : (
        <span className="font-display text-lg font-bold tracking-[0.14em]">{brand.code}</span>
      )}
    </span>
  );
}
