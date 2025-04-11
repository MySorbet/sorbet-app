import { useEffect, useRef, useState } from 'react';

/**
 * Hook that checks if a container's width is at least the specified width
 *
 * Note: Fast vibe coded solution. Revisit and vet if this becomes more widely needed.
 *
 * @param ref Reference to the container element to observe
 * @param minWidth Minimum width to check for (e.g. '81rem')
 */
export function useContainerQuery<T extends HTMLElement>(
  minWidth: string
): { ref: React.RefObject<T>; matches: boolean } {
  const ref = useRef<T>(null);
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    // Convert rem to pixels for calculation
    const remValue = parseFloat(minWidth.replace('rem', ''));
    const pixelValue =
      remValue *
      parseFloat(getComputedStyle(document.documentElement).fontSize);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setMatches(width >= pixelValue);
      }
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, minWidth]);

  return { ref, matches };
}
