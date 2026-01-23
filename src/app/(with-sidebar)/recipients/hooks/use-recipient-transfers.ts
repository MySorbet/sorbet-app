import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { recipientsApi } from '@/api/recipients/recipients';
import { RecipientTransfer } from '@/api/recipients/types';

/** RQ wrapper for GET /recipients/:id/transfers */
export const useRecipientTransfers = (
  recipientId: string,
  options?: Omit<
    UndefinedInitialDataOptions<
      RecipientTransfer[],
      Error,
      RecipientTransfer[],
      string[]
    >,
    'queryKey'
  >
) => {
  return useQuery({
    queryKey: ['recipients', recipientId, 'transfers'],
    queryFn: () => recipientsApi.getRecipientTransfers(recipientId),
    ...options,
  });
};
