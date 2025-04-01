import { useCallback, useEffect, useRef } from 'react';

/**
 * Build a fn to run a callback after a delay within a component
 *
 * @param callback - The function to run after the delay
 * @param delay - The delay in milliseconds (defaults to the default `tailwindcss-animate` duration of 150ms)
 * @returns a function you call to kickoff running the callback after the delay
 */
export const useAfter = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 150
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fn = useCallback(
    (...args: TArgs) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );

  // Cleanup the timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return fn;
};
