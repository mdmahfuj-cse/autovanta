import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Newspaper, RotateCcw, Search, X } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import ArticleCard from '../features/journal/ArticleCard.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { ARTICLES, JOURNAL_CATEGORIES } from '../data/index.js';
import { cn } from '../utils/cn.js';
import { EASE_OUT_EXPO } from '../components/shared/motionTokens.js';

const CATEGORY_COUNTS = Object.fromEntries(
  JOURNAL_CATEGORIES.map((c) => [c, ARTICLES.filter((a) => a.category === c).length])
);

function matches(article, q, category) {
  if (category && article.category !== category) return false;
  if (!q) return true;
  const hay = [article.title, article.excerpt, article.category, article.author, ...article.tags]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token));
}

export default function JournalPage() {
  useDocumentTitle('The Journal');
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  const [qInput, setQInput] = useState(() => searchParams.get('q') ?? '');
  const qTimer = useRef(null);

  const setParam = (key, value) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setQInput(value);
    clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => setParam('q', value.trim() || null), 300);
  };

  const clearSearch = () => {
    setQInput('');
    setParam('q', null);
  };

  const filtered = ARTICLES.filter((a) => matches(a, q, category));
  const [lead, ...rest] = filtered;

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            The journal · {ARTICLES.length} stories
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Stories from <span className="text-secondary">the fast lane</span>.
          </h1>

          {/* Controls */}
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex h-11 w-full max-w-md items-center gap-3 rounded-xl border border-white/12 bg-base-100 px-4 transition-colors focus-within:border-primary/50">
              <Search className="h-4.5 w-4.5 shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={qInput}
                onChange={onSearchChange}
                placeholder="Search stories, authors, tags…"
                aria-label="Search the journal"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
              {qInput && (
                <button type="button" onClick={clearSearch} aria-label="Clear search" className="text-muted transition-colors hover:text-base-content">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setParam('category', null)}
                aria-pressed={!category}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-[13px] transition-colors',
                  !category
                    ? 'border-primary/60 bg-primary/15 text-primary-text'
                    : 'border-white/12 bg-white/[0.03] text-muted hover:border-white/25 hover:text-base-content'
                )}
              >
                All <span className="ml-1 font-mono text-[10px] opacity-60">{ARTICLES.length}</span>
              </button>
              {JOURNAL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setParam('category', category === cat ? null : cat)}
                  aria-pressed={category === cat}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-[13px] transition-colors',
                    category === cat
                      ? 'border-primary/60 bg-primary/15 text-primary-text'
                      : 'border-white/12 bg-white/[0.03] text-muted hover:border-white/25 hover:text-base-content'
                  )}
                >
                  {cat} <span className="ml-1 font-mono text-[10px] opacity-60">{CATEGORY_COUNTS[cat]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="container-x py-12">
        {q || category ? (
          <p className="mb-7 text-sm text-muted" aria-live="polite">
            <Newspaper className="mr-2 inline h-4 w-4" aria-hidden="true" />
            {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
            {category && (
              <>
                {' '}in <span className="font-medium text-base-content">{category}</span>
              </>
            )}
            {q && (
              <>
                {' '}matching <span className="font-medium text-base-content">&ldquo;{q}&rdquo;</span>
              </>
            )}
          </p>
        ) : null}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/12 px-8 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-base-200">
              <Newspaper className="h-6 w-6 text-muted" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-xl font-bold tracking-tight">No stories found</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Nothing in the archive matches that combination. Try a different term or clear the
              filters.
            </p>
            <button
              type="button"
              onClick={() => {
                clearSearch();
                setParam('category', null);
              }}
              className="btn btn-primary btn-md mt-7 rounded-md px-6 font-display tracking-wide"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Lead story */}
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}>
              <ArticleCard article={lead} variant="lead" />
            </motion.div>

            {/* The rest */}
            {rest.length > 0 && (
              <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.slug} article={article} className="h-full" />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
