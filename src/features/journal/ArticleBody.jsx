import SpecTable from '../cars/SpecTable.jsx';

/**
 * Editorial body renderer — maps content blocks to typographic layouts.
 * Blocks: p · h2 · quote {text, cite?} · list {items} · spec {caption, rows}
 */
export default function ArticleBody({ blocks }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} className="mt-12 flex items-center gap-3 font-display text-2xl font-bold tracking-tight first:mt-0">
                <span aria-hidden="true" className="inline-block h-4 w-1 rounded-full bg-primary/70" />
                {block.text}
              </h2>
            );

          case 'quote':
            return (
              <blockquote key={i} className="mt-8 border-l-2 border-primary/60 pl-6">
                <p className="font-display text-xl font-medium leading-relaxed text-secondary">&ldquo;{block.text}&rdquo;</p>
                {block.cite && <cite className="mt-2.5 block font-mono text-xs not-italic tracking-wide text-muted">— {block.cite}</cite>}
              </blockquote>
            );

          case 'list':
            return (
              <ul key={i} className="mt-8 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-3.5 leading-relaxed text-base-content/85">
                    <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case 'spec':
            return (
              <div key={i} className="mt-8">
                <SpecTable title={block.caption ?? 'By the numbers'} rows={block.rows} />
              </div>
            );

          case 'p':
          default:
            return (
              <p key={i} className="mt-6 text-[1.05rem] leading-[1.85] text-base-content/85 first:mt-0">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
