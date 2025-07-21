'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Pencil, Trash2 } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { useRecipientDetails } from '@/app/(with-sidebar)/recipients/hooks/use-recipient-details';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

import { EADetails } from './ea-details';
import {
  VaulSheet,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetTitle,
} from './vaul-sheet';

/**
 * Render a sheet to show recipient details
 * Note: The sheet will attempt to fetch details for the recipient
 */
export const RecipientSheet = ({
  open = false,
  setOpen,
  onSend,
  recipient,
  onAnimationEnd,
  onDelete,
  isDeleting,
}: {
  recipient?: RecipientAPI;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onSend?: () => void;
  onAnimationEnd?: () => void;
  onDelete?: (recipientId: string) => void;
  isDeleting?: boolean;
}) => {
  const isMobile = useIsMobile();
  const direction = isMobile ? 'bottom' : 'right';

  // TODO: Add a loading and error state to EADetails to accompany this
  const { data: details } = useRecipientDetails(recipient?.id ?? '', {
    enabled: recipient && recipient.type !== 'crypto',
  });

  if (!recipient) return null;
  const isDeleteDisabled = recipient.type != 'crypto';

  return (
    <VaulSheet
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={onAnimationEnd}
      direction={direction}
    >
      <VaulSheetContent direction={direction}>
        <VaulSheetHeader>
          <VaulSheetTitle>Details</VaulSheetTitle>
          <VisuallyHidden>
            <VaulSheetDescription>
              Details for {recipient.label}
            </VaulSheetDescription>
          </VisuallyHidden>
        </VaulSheetHeader>
        <ScrollArea className='size-full flex-1'>
          <EADetails
            account={
              // TODO: Extract this "account building" to a fn
              recipient.type === 'usd'
                ? {
                    name: recipient.label,
                    type: recipient.type,
                    accountNumberLast4:
                      details?.externalAccount.account?.last_4 ?? '',
                    routingNumber:
                      details?.externalAccount.account?.routing_number ?? '',
                    accountType:
                      details?.externalAccount.account?.checking_or_savings ??
                      'checking',
                    bankName: details?.externalAccount.bank_name ?? '',
                  }
                : recipient.type === 'crypto'
                ? {
                    name: recipient.label,
                    type: recipient.type,
                    walletAddress: recipient.detail,
                  }
                : {
                    name: recipient.label,
                    type: recipient.type,
                    accountNumberLast4: recipient.detail,
                    country: details?.externalAccount.iban?.country ?? '',
                    bic: details?.externalAccount.iban?.bic ?? '',
                  }
            }
          />
        </ScrollArea>
        <VaulSheetFooter className='flex flex-row justify-between gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='secondary'
                onClick={() => {
                  onDelete?.(recipient.id);
                }}
                disabled={isDeleting || isDeleteDisabled}
              >
                {isDeleting ? <Spinner /> : <Trash2 />}
              </Button>
            </TooltipTrigger>
            {isDeleteDisabled && (
              <TooltipContent side='top' sideOffset={8}>
                Deleting bank recipients is not currently supported. Check back
                soon 🚀
              </TooltipContent>
            )}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='secondary' disabled>
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top' sideOffset={8}>
              Editing recipients is not currently supported. Check back soon 🚀
            </TooltipContent>
          </Tooltip>
          <Button variant='sorbet' onClick={onSend} className='flex-1'>
            Send funds
          </Button>
        </VaulSheetFooter>
      </VaulSheetContent>
    </VaulSheet>
  );
};
