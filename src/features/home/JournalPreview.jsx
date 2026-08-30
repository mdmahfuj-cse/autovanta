import ArticleCard from '../journal/ArticleCard.jsx';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import Reveal from '../../components/shared/Reveal.jsx';
import { Stagger, StaggerItem } from '../../components/shared/Stagger.jsx';
import { ARTICLES } from '../../data/index.js';
import { PATHS_EXPORTS } from './homeLinks.js';

/**
 * Homepage §11 — Automotive Journal: one lead story + two stacked sidebars,
 * magazine-style composition.
 */
export default function JournalPreview() {
  const [lead, ...rest] = ARTICLES;
  const side = rest.slice(0, 2);

  return (
    <section className="container-x py-24 lg:py-28" aria-labelledby="journal-heading">
      <SectionHeading
        eyebrow="The journal"
        title="Stories from the fast lane"
        description="Reviews, buying guides and tech explainers written by the people who walk the floor — not a content farm."
        action={{ to: PATHS_EXPORTS.journal, label: 'All stories' }}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Stagger className="h-full">
          <StaggerItem className="h-full">
            <ArticleCard article={lead} variant="lead" className="h-full" />
          </StaggerItem>
        </Stagger>

        <Stagger className="grid gap-6" delay={0.08}>
          {side.map((article) => (
            <StaggerItem key={article.slug} className="h-full">
              <ArticleCard article={article} className="h-full" />
            </StaggerItem>
          ))}
          <Reveal delay={0.1}>
            <div className="flex items-center justify-between rounded-xl border border-dashed border-white/12 px-6 py-5">
              <p className="text-sm text-muted">
                <span className="font-display font-semibold text-base-content">{ARTICLES.length} stories</span> across 6
                categories — new issues weekly.
              </p>
              <a
                href={PATHS_EXPORTS.journal}
                className="shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-primary-text transition-opacity hover:opacity-80"
              >
                Browse →
              </a>
            </div>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}
