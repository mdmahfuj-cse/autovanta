import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Newspaper } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import ArticleBody from '../features/journal/ArticleBody.jsx';
import ArticleCard from '../features/journal/ArticleCard.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { ARTICLES, ARTICLES_BY_SLUG, JOURNAL_CATEGORIES, TEAM } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { formatDate } from '../utils/format.js';

function ArticleNotFound() {
  return (
    <PageTransition className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-base-200">
        <Newspaper className="h-7 w-7 text-muted" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Story not found.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        That page was never printed, or it has been moved to the archive. The latest issue is one
        click away.
      </p>
      <Link to={PATHS.journal} className="btn btn-primary btn-md mt-8 rounded-md px-7 font-display tracking-wide">
        Back to the journal <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </PageTransition>
  );
}

function AuthorCard({ article }) {
  const member = TEAM.find((m) => m.name === article.author);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/8 bg-base-200 p-6">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-white/[0.07] to-transparent font-display text-sm font-bold tracking-[0.12em]"
      >
        {member?.initials ?? article.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
      </span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Written by</p>
        <p className="mt-1 font-display text-base font-bold tracking-tight">{article.author}</p>
        <p className="text-xs text-muted">{member?.role ?? 'Contributor'}</p>
        {member?.focus && <p className="mt-2 text-sm leading-relaxed text-muted">{member.focus}</p>}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES_BY_SLUG[slug];

  useDocumentTitle(article ? article.title : 'Story not found');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  if (!article) {
    return <ArticleNotFound />;
  }

  const sameCategory = ARTICLES.filter((a) => a.slug !== article.slug && a.category === article.category);
  const others = ARTICLES.filter((a) => a.slug !== article.slug && a.category !== article.category);
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <PageTransition>
      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-16 z-40 h-0.5 origin-left bg-primary/80"
        style={{ scaleX: progress }}
      />

      <article className="container-x pb-24 pt-28 lg:pt-32">
        <Reveal y={10}>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <Link to={PATHS.home} className="transition-colors hover:text-base-content">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to={PATHS.journal} className="transition-colors hover:text-base-content">Journal</Link>
            <span aria-hidden="true">/</span>
            <Link
              to={`${PATHS.journal}?category=${encodeURIComponent(article.category)}`}
              className="transition-colors hover:text-base-content"
            >
              {article.category}
            </Link>
          </nav>
        </Reveal>

        {/* Header */}
        <header className="mx-auto mt-8 max-w-3xl text-center">
          <Reveal>
            <Link
              to={`${PATHS.journal}?category=${encodeURIComponent(article.category)}`}
              className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-text transition-colors hover:bg-primary/20"
            >
              {article.category}
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-5 font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-5xl">
              {article.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-lg leading-relaxed text-muted">{article.excerpt}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] font-display text-[10px] font-bold tracking-[0.1em]"
                >
                  {article.author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <span className="font-medium text-base-content/85">{article.author}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {article.readTime} min read
              </span>
            </div>
          </Reveal>
        </header>

        {/* Cover */}
        <Reveal delay={0.1} y={24} className="mx-auto mt-10 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={article.cover} alt="" className="aspect-[16/8] w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-base-100/60 via-transparent to-transparent" />
          </div>
        </Reveal>

        {/* Body + sidebar */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-14 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0">
            <ArticleBody blocks={article.content} />

            {/* Tags */}
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/8 pt-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Filed under</span>
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <AuthorCard article={article} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-white/8 bg-base-200 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Categories</p>
              <ul className="mt-3 space-y-1.5">
                {JOURNAL_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`${PATHS.journal}?category=${encodeURIComponent(cat)}`}
                      className={
                        cat === article.category
                          ? 'flex items-center justify-between rounded-md bg-primary/10 px-3 py-1.5 text-sm text-primary-text'
                          : 'flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-base-content'
                      }
                    >
                      {cat}
                      <span className="font-mono text-[10px] opacity-60">
                        {ARTICLES.filter((a) => a.category === cat).length}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/10 bg-base-200 p-5">
              <p className="font-display text-sm font-bold tracking-tight">Test drive the story</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Reading about a car on our floor? Book a drive — the real review is yours to write.
              </p>
              <Link to={PATHS.testDrive} className="btn btn-primary btn-sm mt-4 w-full rounded-md font-display tracking-wide">
                Book a test drive
              </Link>
            </div>
          </aside>
        </div>

        {/* Related */}
        <section className="mx-auto mt-20 max-w-5xl" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-heading" className="font-display text-2xl font-bold tracking-tight">
              More from the journal
            </h2>
            <Link
              to={PATHS.journal}
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary-text transition-opacity hover:opacity-80"
            >
              All stories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} className="h-full" />
            ))}
          </div>
        </section>

        <Reveal className="mx-auto mt-14 max-w-5xl">
          <Link to={PATHS.journal} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-base-content">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all stories
          </Link>
        </Reveal>
      </article>
    </PageTransition>
  );
}
