import useScreenWidth from './use-screen-width';

/**
 * Hook to check if the screen is mobile
 * Arbitrarily uses 32rem as the mobile break width. This matches the default tailwind `@lg` container breakpoint
 * @returns {boolean} True if the screen is mobile
 */
export const useIsMobile = () => {
  const screenWidth = useScreenWidth();
  const mobileWidth = 32 * 16; // 32rem
  return screenWidth && screenWidth < mobileWidth;
};
