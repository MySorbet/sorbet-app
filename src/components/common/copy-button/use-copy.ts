import { useCallback, useRef, useState } from 'react';

/**
 * The param you can pass to the `useCopy` hook.
 * If you pass a string, it will be copied to the clipboard.
 * If you pass a function, it will be called.
 */
export type UseCopyParam = string | (() => void) | undefined;

type UseCopyReturn = {
  isCopied: boolean /** Whether the copy operation is in progress. True for 1.5 seconds after the copy operation is initiated. Then false. */;
  handleClick: () => void /** The function you should pass to your button's `onClick` prop. */;
};

/**
 * Use this hook to build "copy buttons" which can copy text to the clipboard and render a confirmation UI for a period of time.
 *
 * `handleClick` is the function you should pass to your button's `onClick` prop. When this is called, either:
 * 1. If you passed a string arg, the text will be copied to the clipboard.
 * 2. If you passed a function, that function will be called.
 *
 * `isCopied` will be `true` for 1.5 seconds after the copy operation is initiated. You can use it to show a check or similar UI
 */
function useCopy(copyParam: UseCopyParam): UseCopyReturn {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    setIsCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      timeoutRef.current = null;
    }, 1500);

    // If the copy param is a string, copy it to the clipboard. Otherwise, call the function.
    if (copyParam !== undefined) {
      if (typeof copyParam === 'string') {
        navigator.clipboard.writeText(copyParam);
      } else {
        copyParam();
      }
    }
  }, [copyParam]);

  return { isCopied, handleClick };
}

export default useCopy;
