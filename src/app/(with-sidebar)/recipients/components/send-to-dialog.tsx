import { RecipientAPI } from '@/api/recipients/types';
import {
  Credenza,
  CredenzaContent,
} from '@/components/common/credenza/credenza';

import { SendToForm } from './send-to-form';

/**
 * Dialog rendering the send to form.
 */
export const SendToDialog = ({
  recipients,
  recipientId,
  onAdd,
  onSend,
  maxAmount,
  open,
  setOpen,
}: {
  className?: string;
  recipients?: RecipientAPI[];
  recipientId?: string;
  onAdd?: () => void;
  onSend?: (amount: number, address: string) => void;
  maxAmount?: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent>
        <SendToForm
          recipients={recipients}
          recipientId={recipientId}
          onSend={onSend}
          maxAmount={maxAmount}
          onAdd={onAdd}
        />
      </CredenzaContent>
    </Credenza>
  );
};
