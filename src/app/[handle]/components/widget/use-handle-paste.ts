import { useEffect } from 'react';

import { normalizeUrl } from '@/components/profile/widgets/util';

/** Hook that handles pasting URLs globally, ignoring paste events in input elements */
export const useHandlePaste = (onPasteUrl: (url: string) => void) =>
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      // Don't handle if another component has already handled this paste
      if (event.defaultPrevented) {
        return;
      }

      // Don't handle paste events in input-like elements
      const target = event.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      try {
        const text = event.clipboardData?.getData('text/plain');
        if (!text) return;

        const normalizedUrl = normalizeUrl(text);
        if (normalizedUrl) {
          // Prevent other paste handlers since we're handling this URL
          event.preventDefault();
          onPasteUrl(normalizedUrl);
        }
      } catch (error) {
        // Silent fail - if we can't handle the paste, let other handlers try
        console.error('Failed to handle paste event:', error);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onPasteUrl]);
