import { useQueryClient } from '@tanstack/react-query';

/**
 * Create an `open` function that will open a link in a new tab and poll until the window is closed, then invalidate the given query key
 */
export const useOpenPollAndInvalidate = () => {
  const queryClient = useQueryClient();

  const openLinkInNewTabWithInvalidation = (
    link: string,
    queryKeyToInvalidate: string,
    interval = 1000
  ) => {
    const newWindow = window.open(link, '_blank');

    // Add window event listener to detect when popup closes
    const checkWindow = setInterval(() => {
      if (newWindow?.closed) {
        clearInterval(checkWindow);
        console.log('New window closed');
        queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
      }
    }, interval);
  };

  return { open: openLinkInNewTabWithInvalidation };
};
