import { RecipientAPI } from '@/api/recipients/types';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';

import {
  SendToForm,
  SendToFormBackButton,
  SendToFormContext,
  SendToFormSubmitButton,
} from './send-to-form';

/** Render the send-to form in a dialog/drawer */
export const SendToDialog = ({
  recipients,
  selectedRecipientId,
  onAdd,
  onSend,
  maxAmount,
  open,
  setOpen,
}: {
  /** Which recipients can be sent to? */
  recipients?: RecipientAPI[];
  /** Specify a recipient id to be preselected */
  selectedRecipientId?: string;
  /** Callback for a recipient to be created */
  onAdd?: () => void;
  /** Callback for a form submission */
  onSend?: (amount: number, address: string) => Promise<void>;
  /** The form will allow leq this amount of USDC to sent. */
  maxAmount?: number;

  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <SendToFormContext
      recipients={recipients}
      selectedRecipientId={selectedRecipientId}
      maxAmount={maxAmount}
    >
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent>
          <CredenzaHeader className='text-left'>
            <CredenzaTitle>Send funds</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody className='pt-4'>
            <SendToForm onSend={onSend} onAdd={onAdd} />
          </CredenzaBody>
          <CredenzaFooter>
            <SendToFormBackButton />
            <SendToFormSubmitButton />
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </SendToFormContext>
  );
};
