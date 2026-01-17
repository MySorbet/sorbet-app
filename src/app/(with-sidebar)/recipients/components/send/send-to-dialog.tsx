import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { useAfter } from '@/hooks/use-after';

import { useSendTo } from '../../hooks/use-send-to';
import {
  SendToFormContext,
  useSendToContext,
  useSendToFormState,
} from './send-to-context';
import {
  SendToForm,
  SendToFormBackButton,
  SendToFormSubmitButton,
} from './send-to-form';

/** Render the send-to form in a dialog/drawer */
export const SendToDialog = ({ onAdd }: { onAdd?: () => void }) => {
  const { open: sendToOpen, set, sendToId } = useSendTo();

  return (
    <SendToFormContext selectedRecipientId={sendToId}>
      <SendToDialogWithReset
        onAdd={onAdd}
        open={sendToOpen}
        setOpen={(open) => set({ open })}
      />
    </SendToFormContext>
  );
};

const SendToDialogWithReset = ({
  onAdd,
  open,
  setOpen,
}: {
  onAdd?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { isSubmitting } = useSendToFormState();

  // Clear the send to experience after it is closed
  const { reset } = useSendToContext();
  const clear = useAfter(reset, 300);
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
          <VisuallyHidden>
            <CredenzaDescription>Send funds to a recipient</CredenzaDescription>
          </VisuallyHidden>
        </CredenzaHeader>
        <CredenzaBody className='pt-4'>
          <SendToForm onAdd={onAdd} />
        </CredenzaBody>
        <CredenzaFooter className='flex flex-col gap-3 sm:flex-row'>
          <SendToFormSubmitButton />
          <SendToFormBackButton onClose={() => setOpen(false)} />
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
