import { useIsMobile } from '@/hooks/use-mobile';

import { useOpenOnDesktopDrawer } from './open-on-desktop-drawer';

/**
 * Returns a function to conditionally call the `fn` parameter.
 *
 * If the user is on mobile, the `fn` will not be called and the "open on desktop" drawer will be opened.
 *
 * @example
 * ```tsx
 * const useUnlessMobile = useUnlessMobile();
 * const handleClick = useUnlessMobile(() => {
 *   shouldOnlyRunOnDesktop();
 * });
 * ```
 */
export const useUnlessMobile = () => {
  const isMobile = useIsMobile();
  const [, setOpen] = useOpenOnDesktopDrawer();

  const f = (fn: () => void) => {
    if (isMobile) {
      console.log('opening desktop drawer');
      setOpen(true);
    } else {
      fn();
    }
  };

  return f;
};
