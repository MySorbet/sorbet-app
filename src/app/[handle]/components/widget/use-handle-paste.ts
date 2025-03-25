import { useEffect } from 'react';

import { normalizeUrl } from '@/components/profile/widgets/util';

/** Hook that handles pasting URLs globally, ignoring paste events in input elements */
export const useHandlePaste = (
  /** Called when a valid url is pasted. The url is normalized. */
  onPasteUrl: (url: string) => void,
  /** Whether to enable the paste handler. Defaults to true. */
  enabled = true
) =>
  useEffect(() => {
    if (!enabled) return;

    const handlePaste = (event: ClipboardEvent) => {
      // Don't handle if another component has already handled this paste
      // or if the handler is disabled
      if (event.defaultPrevented || !enabled) {
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
  }, [onPasteUrl, enabled]);
