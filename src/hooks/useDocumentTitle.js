import { useEffect } from 'react';

/** Keep the document title in sync per page. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · AutoVanta`
      : 'AutoVanta — Premium Automotive Showroom';
  }, [title]);
}
