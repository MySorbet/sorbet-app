import { checkIsAccountAvailable } from '../../api/auth';
import { useQuery } from '@tanstack/react-query';

export const useCheckIsAccountAvailable = (username: string) => {
  return useQuery({
    queryKey: ['account-available'],
    queryFn: async () => await checkIsAccountAvailable(username),
  });
};
