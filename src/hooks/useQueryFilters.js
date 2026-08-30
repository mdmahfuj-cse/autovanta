import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const FILTER_KEYS = ['q', 'brand', 'category', 'fuel', 'transmission', 'flag', 'maxPrice'];

/**
 * Catalogue filter state, synced to the URL query string.
 * The URL is the source of truth — every view is shareable and
 * back-button correct. `setParam(key, undefined)` removes the param.
 */
export function useQueryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === undefined || value === null || value === '') next.delete(key);
          else next.set(key, String(value));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearAll = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        FILTER_KEYS.forEach((k) => next.delete(k));
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const params = {
    q: searchParams.get('q') ?? '',
    brand: searchParams.get('brand') ?? '',
    category: searchParams.get('category') ?? '',
    fuel: searchParams.get('fuel') ?? '',
    transmission: searchParams.get('transmission') ?? '',
    flag: searchParams.get('flag') ?? '',
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    sort: searchParams.get('sort') ?? 'featured',
  };

  const activeCount = FILTER_KEYS.filter((k) => params[k]).length;

  return { params, setParam, clearAll, activeCount };
}
