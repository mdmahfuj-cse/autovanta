import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { PATHS } from '../../routes/paths.js';
import { cn } from '../../utils/cn.js';
import { formatDate } from '../../utils/format.js';

/**
 * Editorial article card. `variant="lead"` renders a tall magazine-style
 * cover; the default is a compact horizontal-friendly card.
 */
export default function ArticleCard({ article, variant = 'default', className }) {
  const lead = variant === 'lead';

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border border-white/8 bg-base-200 transition-colors duration-300 hover:border-white/20',
        lead ? 'flex h-full flex-col' : 'flex',
        className
      )}
    >
      <Link
        to={PATHS.article(article.slug)}
        className="absolute inset-0 z-[5]"
        aria-label={`Read: ${article.title}`}
      />

      <div className={cn('relative overflow-hidden', lead ? 'aspect-[16/9]' : 'hidden w-40 shrink-0 sm:block')}>
        <img
          src={article.cover}
          alt=""
          loading="lazy"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]',
            !lead && 'h-full'
          )}
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85 backdrop-blur">
          {article.category}
        </span>
      </div>

      <div className={cn('flex flex-1 flex-col p-5', lead && 'gap-3 p-6')}>
        <span className={cn('font-mono text-[10px] uppercase tracking-[0.16em] text-muted', lead && 'hidden')}>
          {article.category}
        </span>
        <h3
          className={cn(
            'font-display font-bold leading-snug tracking-tight transition-colors group-hover:text-primary-text',
            lead ? 'text-xl md:text-2xl' : 'text-base'
          )}
        >
          {article.title}
        </h3>
        <p className={cn('text-sm leading-relaxed text-muted', lead ? 'line-clamp-3' : 'line-clamp-2')}>{article.excerpt}</p>
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted">
          <span className="font-medium text-base-content/80">{article.author}</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-muted" />
          <span>{formatDate(article.date)}</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-muted" />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" /> {article.readTime} min
          </span>
          <ArrowUpRight
            className="ml-auto h-4 w-4 text-primary-text opacity-0 transition-all duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
