import { useEffect, useState } from 'react';

/**
 * Hook to get the current screen width
 * @returns {number | null} The current screen width
 * @see https://stackoverflow.com/a/72943886
 */
export default function useScreenWidth() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  const isWindow = typeof window !== 'undefined';

  const getWidth = () => (isWindow ? window.innerWidth : windowWidth);

  const resize = () => setWindowWidth(getWidth());

  useEffect(() => {
    if (isWindow) {
      setWindowWidth(getWidth());

      window.addEventListener('resize', resize);

      return () => window.removeEventListener('resize', resize);
    }
    //eslint-disable-next-line
  }, [isWindow]);

  return windowWidth;
}
