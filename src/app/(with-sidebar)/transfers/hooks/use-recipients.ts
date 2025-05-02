import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { recipientsApi } from '@/api/recipients/recipients';
import { RecipientAPI } from '@/api/recipients/types';

/** RQ wrapper for GET /recipients */
export const useRecipients = (
  options?: Omit<
    UndefinedInitialDataOptions<
      RecipientAPI[],
      Error,
      RecipientAPI[],
      string[]
    >,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: ['recipients'],
    queryFn: () => recipientsApi.getRecipients(),
    ...options,
  });
};
