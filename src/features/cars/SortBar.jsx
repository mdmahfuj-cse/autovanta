import { LayoutGrid, List } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/carFilters.js';
import { cn } from '../../utils/cn.js';

/**
 * Catalogue toolbar — result count, sort select, grid/list toggle.
 */
export default function SortBar({ count, total, sort, onSort, viewMode, onViewMode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="mr-auto text-sm text-muted" aria-live="polite">
        Showing <span className="font-semibold text-base-content">{count}</span> of {total} vehicles
      </p>

      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          aria-label="Sort vehicles"
          className="h-10 appearance-none rounded-md border border-white/12 bg-base-200 pl-3.5 pr-9 text-sm text-base-content outline-none transition-colors hover:border-white/25 focus-visible:border-primary/50"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          style={{ fontSize: '10px' }}
        >
          ▼
        </span>
      </div>

      <div className="flex items-center rounded-md border border-white/12 bg-base-200 p-1" role="group" aria-label="View mode">
        <button
          type="button"
          onClick={() => onViewMode('grid')}
          aria-pressed={viewMode === 'grid'}
          aria-label="Grid view"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded transition-colors',
            viewMode === 'grid' ? 'bg-primary/15 text-primary-text' : 'text-muted hover:text-base-content'
          )}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onViewMode('list')}
          aria-pressed={viewMode === 'list'}
          aria-label="List view"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded transition-colors',
            viewMode === 'list' ? 'bg-primary/15 text-primary-text' : 'text-muted hover:text-base-content'
          )}
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
