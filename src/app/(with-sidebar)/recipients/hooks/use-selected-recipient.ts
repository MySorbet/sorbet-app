import { useQueryState } from 'nuqs';
import { useMemo } from 'react';

import { RecipientAPI } from '@/api/recipients/types';

/**
 * Type safety for managing the selected recipient in the url.
 * Pass this hook all recipients as fetched from the API. It will find the recipient by id and make it available.
 */
export const useSelectedRecipient = (recipients?: RecipientAPI[]) => {
  const [selectedRecipientId, setSelectedRecipientId] =
    useQueryState('selected-recipient');

  const recipientsMap = useMemo(
    () => new Map(recipients?.map((recipient) => [recipient.id, recipient])),
    [recipients]
  );

  const selectedRecipient = useMemo(
    () =>
      selectedRecipientId ? recipientsMap.get(selectedRecipientId) : undefined,
    [recipientsMap, selectedRecipientId]
  );

  return { selectedRecipient, setSelectedRecipientId, recipientsMap };
};
