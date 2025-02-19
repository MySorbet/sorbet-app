'use client';

import { Copy, Download, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { ConfirmSendDialog } from '../confirm-send-dialog';
import { InvoiceHeader } from './invoice-header';

/** A group of buttons for actions on a published invoice */
export const PublishedInvoiceHeader = ({
  onCopy,
  onDownload,
  onSend,
  className,
  recipientEmail,
}: {
  onCopy?: () => void;
  onDownload?: () => void;
  onSend?: () => void;
  className?: string;
  recipientEmail: string;
}) => {
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  return (
    <InvoiceHeader>
      <h1 className='animate-in fade-in-0 slide-in-from-left-5 text-sm font-medium'>
        Invoice published!
      </h1>

      <div className={cn('ml-auto [&>*+*]:border-l-0', className)}>
        <ConfirmSendDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          recipientEmail={recipientEmail}
          onConfirm={onSend}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='rounded-none first:rounded-l-md'
              onClick={onCopy}
            >
              <Copy className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='rounded-none'
              onClick={onDownload}
            >
              <Download className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Download</TooltipContent>
        </Tooltip>

        <Button
          variant='sorbet'
          className='gap-2 rounded-none last:rounded-r-md'
          onClick={() => setSendDialogOpen(true)}
        >
          <Send className='size-4' />
          Send Now
        </Button>
      </div>
    </InvoiceHeader>
  );
};
