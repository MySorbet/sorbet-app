import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { recipientsApi } from '@/api/recipients/recipients';
import { RecipientAPIBankDetailed } from '@/api/recipients/types';

/** RQ wrapper for GET /recipients/:id */
export const useRecipientDetails = (
  recipientId: string,
  options?: Omit<
    UndefinedInitialDataOptions<
      RecipientAPIBankDetailed,
      Error,
      RecipientAPIBankDetailed,
      string[]
    >,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: ['recipients', recipientId],
    queryFn: () => recipientsApi.getRecipientDetails(recipientId),
    ...options,
  });
};
