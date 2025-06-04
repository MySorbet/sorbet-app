import { RecipientAPI } from '@/api/recipients/types';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
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
  onSend?: (amount: number, address: string) => Promise<void>;
  maxAmount?: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Send funds</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <SendToForm
            recipients={recipients}
            recipientId={recipientId}
            onSend={onSend}
            maxAmount={maxAmount}
            onAdd={onAdd}
          />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};
