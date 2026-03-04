import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { clientsApi } from '@/api/clients/clients';
import { ClientAPI } from '@/api/clients/types';

/** RQ wrapper for GET /clients */
export const useClients = (
  options?: Omit<
    UndefinedInitialDataOptions<
      ClientAPI[],
      Error,
      ClientAPI[],
      string[]
    >,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getClients(),
    ...options,
  });
};
