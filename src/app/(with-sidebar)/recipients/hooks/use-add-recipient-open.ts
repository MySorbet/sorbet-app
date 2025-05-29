import { parseAsBoolean, useQueryState } from 'nuqs';

/** Type safety for managing the open state of the add recipient sheet in the url */
export const useAddRecipientOpen = () =>
  useQueryState('add-recipient', parseAsBoolean.withDefault(false));
