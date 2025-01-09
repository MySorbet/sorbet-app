import { useAuth } from './use-auth';
import { useLocalStorage } from './use-local-storage';

/** Use a local storage key with the users id appended to persist info scoped to the logged in user
 *
 * Note: Will throw if used called when useAuth does not yet have a user
 */
export const useScopedLocalStorage = <T = unknown>(
  key: string,
  defaultValue: T
) => {
  const { user } = useAuth();
  if (!user) {
    throw new Error('Cannot use scoped local storage without a user');
  }
  const [storedValue, setStoredValue] = useLocalStorage(
    `sorbet:${key}:${user.id}`,
    defaultValue
  );

  return [storedValue, setStoredValue] as const;
};
