import { useQueryState } from 'nuqs';

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { useAfter } from '@/hooks/use-after';

import {
  SendToForm,
  SendToFormBackButton,
  SendToFormContext,
  SendToFormSubmitButton,
  useSendToContext,
  useSendToFormContext,
  useSendToFormState,
} from './send-to-form';
import { useFormState } from 'react-hook-form';

/** Render the send-to form in a dialog/drawer */
export const SendToDialog = ({ onAdd }: { onAdd?: () => void }) => {
  const [sendTo, setSendTo] = useQueryState('send-to');
  const open = !!sendTo;
  const setOpen = (open: boolean) => setSendTo(open ? 'true' : null);
  const recipientIdToSendTo =
    sendTo === 'true' ? undefined : sendTo ? sendTo : undefined;

  return (
    <SendToFormContext selectedRecipientId={recipientIdToSendTo}>
      <SendToDialogWithReset onAdd={onAdd} open={open} setOpen={setOpen} />
    </SendToFormContext>
  );
};

export const SendToDialogWithReset = ({
  onAdd,
  open,
  setOpen,
}: {
  onAdd?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { reset } = useSendToContext();
  const { isSubmitting } = useSendToFormState();

  const clear = useAfter(() => {
    reset();
  }, 300);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    !open && clear();
  };

  return (
    <Credenza
      open={open}
      onOpenChange={handleOpenChange}
      dismissible={!isSubmitting}
    >
      <CredenzaContent>
        <CredenzaHeader className='text-left'>
          <CredenzaTitle>Send funds</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className='pt-4'>
          <SendToForm onAdd={onAdd} />
        </CredenzaBody>
        <CredenzaFooter>
          <SendToFormBackButton onClose={() => setOpen(false)} />
          <SendToFormSubmitButton />
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
