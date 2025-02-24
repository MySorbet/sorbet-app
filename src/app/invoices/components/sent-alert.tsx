import { MailCheckIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

/** An alert that shows when an invoice has been sent */
export const SentAlert = ({
  recipientEmail,
  className,
}: {
  recipientEmail: string;
  className?: string;
}) => {
  return (
    <Alert className={cn('h-fit', className)}>
      <MailCheckIcon className='size-5' />
      <AlertTitle>Invoice sent</AlertTitle>
      <AlertDescription>
        We sent an email to {recipientEmail} with a link to this invoice
      </AlertDescription>
    </Alert>
  );
};
