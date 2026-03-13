import { isRestrictedCountry } from '@/app/signin/components/business/country-restrictions';
import { useAuth } from '@/hooks/use-auth';

/** Returns true if the current user's country is on the Virtual Account restriction list */
export const useIsCountryRestricted = (): boolean => {
  const { user } = useAuth();
  return isRestrictedCountry(user?.country);
};
