import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';

/** Remember if the user has their profile via local storage */
export const useHasShared = () => {
  const [hasShared, setHasShared] = useScopedLocalStorage(`has-shared`, false);

  return [hasShared, setHasShared] as const;
};
