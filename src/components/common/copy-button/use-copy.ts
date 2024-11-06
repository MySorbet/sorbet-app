import { useCallback, useRef, useState } from 'react';

/**
 * Use this hook to handle build "copy buttons".
 *
 * `handleClick` is the function you should pass to your button's `onClick` prop.
 * `isCopied` will be `true` for 1.5 seconds after the copy operation is initiated. You can use it to show a check or similar
 */
const useCopy = (onCopy: () => void) => {
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

    onCopy();
  }, [onCopy]);

  return { isCopied, handleClick };
};

export default useCopy;
