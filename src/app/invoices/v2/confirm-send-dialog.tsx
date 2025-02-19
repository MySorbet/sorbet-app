import { useEffect, useRef } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { CheckIcon, CheckIconHandle } from '@/components/ui/check';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { SendIcon, SendIconHandle } from '@/components/ui/send';

interface ConfirmSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientEmail: string;
  onConfirm?: () => void;
  isSending?: boolean;
  hasSent?: boolean;
  onBackToDashboard?: () => void;
  onViewInvoices?: () => void;
}

/** Dialog for confirming the sending of an invoice */
export const ConfirmSendDialog = ({
  open,
  onOpenChange,
  recipientEmail,
  onConfirm,
  isSending = false,
  hasSent = false,
  onBackToDashboard,
  onViewInvoices,
}: ConfirmSendDialogProps) => {
  const primaryText = hasSent
    ? 'View invoices'
    : isSending
    ? 'Sending...'
    : 'Send now';
  const secondaryText = hasSent ? 'Back to dashboard' : 'Cancel';
  const titleText = hasSent ? 'Invoice sent!' : 'Send invoice';
  const descriptionText = hasSent
    ? 'Your invoice has been sent to: '
    : 'Confirm to send your invoice to: ';

  // Animate on send
  const sendIconRef = useRef<SendIconHandle>(null);
  const checkIconRef = useRef<CheckIconHandle>(null);
  useEffect(() => {
    if (isSending) {
      sendIconRef.current?.startAnimation();
    } else {
      sendIconRef.current?.stopAnimation();
    }
  }, [isSending]);

  useEffect(() => {
    if (hasSent) {
      checkIconRef.current?.startAnimation();
    }
  }, [hasSent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[400px] p-6'>
        <div className='flex flex-col items-center gap-1.5 text-center'>
          {hasSent ? (
            <CheckIcon
              className='pointer-events-none [&>svg]:size-12 [&>svg]:stroke-[1.5] [&>svg]:p-1'
              ref={checkIconRef}
            />
          ) : (
            <SendIcon
              className='pointer-events-none [&>svg]:size-12 [&>svg]:stroke-[1.5] [&>svg]:p-1'
              ref={sendIconRef}
            />
          )}

          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription className='text-sm'>
            {descriptionText}
            <p>{recipientEmail}</p>
          </DialogDescription>
        </div>

        <div className='flex flex-col gap-3'>
          <Button
            onClick={() => (hasSent ? onViewInvoices?.() : onConfirm?.())}
            variant='sorbet'
            disabled={isSending}
          >
            {isSending && <Spinner />}
            {primaryText}
          </Button>
          <Button
            onClick={() =>
              hasSent ? onBackToDashboard?.() : onOpenChange(false)
            }
            variant='secondary'
            disabled={isSending}
          >
            {secondaryText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
