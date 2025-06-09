import { useQueryState } from 'nuqs';

/**
 * Type safety for managing the send-to state in the url.
 * You may set this to a recipient id or `true` to open the send-to dialog.
 */
export const useSendTo = () => {
  const [sendTo, setSendTo] = useQueryState('send-to');

  const open = !!sendTo;
  const set = (params: { open: boolean } | { recipientId: string }) => {
    if ('open' in params) {
      setSendTo(params.open ? 'true' : null);
    } else {
      setSendTo(params.recipientId);
    }
  };
  const sendToId = sendTo === 'true' ? undefined : sendTo ? sendTo : undefined;

  return { open, set, sendToId };
};
