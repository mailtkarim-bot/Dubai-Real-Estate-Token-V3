import { useEffect } from 'react';

/**
 * Custom hook that updates the document title with an automatic "| DREIT" suffix.
 *
 * @param title - The page title (e.g. "Investor Dashboard")
 *
 * @example
 * ```tsx
 * useDocumentTitle('Investor Dashboard');
 * // document.title === "Investor Dashboard | DREIT"
 * ```
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | DREIT`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}

export default useDocumentTitle;
