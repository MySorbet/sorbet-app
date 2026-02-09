'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Trash2 } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { useRecipientDetails } from '@/app/(with-sidebar)/recipients/hooks/use-recipient-details';
import { useRecipientTransfers } from '@/app/(with-sidebar)/recipients/hooks/use-recipient-transfers';
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
import { RecipientTransfersTable } from './recipient-transfers-table';
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
    enabled:
      !!recipient &&
      recipient.type !== 'crypto_base' &&
      recipient.type !== 'crypto_stellar',
  });

  const { data: transfers, isLoading: transfersLoading } =
    useRecipientTransfers(recipient?.id ?? '', {
      enabled: !!recipient && !isMobile,
    });

  if (!recipient) return null;
  const isDeleteDisabled =
    recipient.type !== 'crypto_base' && recipient.type !== 'crypto_stellar';

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
          <div className='space-y-6'>
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
                  : recipient.type === 'crypto_base' ||
                    recipient.type === 'crypto_stellar'
                  ? {
                      name: recipient.label,
                      type: 'crypto',
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
            {/* Transfers table - desktop only */}
            {!isMobile && (
              <div>
                <h3 className='mb-2 text-base font-semibold'>Transfers</h3>
                <RecipientTransfersTable
                  transfers={transfers}
                  isLoading={transfersLoading}
                />
              </div>
            )}
          </div>
        </ScrollArea>
        <VaulSheetFooter>
          {isMobile ? (
            <div className='flex w-full flex-col gap-2'>
              <Button variant='sorbet' onClick={onSend} className='w-full'>
                Send funds
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    className='text-destructive border-destructive hover:bg-destructive/10 w-full'
                    onClick={() => onDelete?.(recipient.id)}
                    disabled={isDeleting || isDeleteDisabled}
                  >
                    {isDeleting ? <Spinner /> : <Trash2 className='size-4' />}
                    Delete
                  </Button>
                </TooltipTrigger>
                {isDeleteDisabled && (
                  <TooltipContent side='top' sideOffset={8}>
                    Deleting bank recipients is not currently supported
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          ) : (
            <div className='flex w-full flex-row gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='text-destructive border-destructive hover:bg-destructive/10'
                    onClick={() => onDelete?.(recipient.id)}
                    disabled={isDeleting || isDeleteDisabled}
                  >
                    {isDeleting ? <Spinner /> : <Trash2 className='size-4' />}
                  </Button>
                </TooltipTrigger>
                {isDeleteDisabled && (
                  <TooltipContent side='top' sideOffset={8}>
                    Deleting bank recipients is not currently supported
                  </TooltipContent>
                )}
              </Tooltip>
              <Button variant='sorbet' onClick={onSend} className='flex-1'>
                Send funds
              </Button>
            </div>
          )}
        </VaulSheetFooter>
      </VaulSheetContent>
    </VaulSheet>
  );
};
