'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  DuePaymentMethod,
  PAYMENT_METHOD_OPTIONS,
  RecipientAPI,
  RecipientAPIBankDetailed,
} from '@/api/recipients/types';
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
import { MigrateRecipientSheet } from './migrate-recipient-sheet';
import { RecipientTransfersTable } from './recipient-transfers-table';
import {
  VaulSheet,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetTitle,
} from './vaul-sheet';

/** Check if type is a Due payment method */
const isDuePaymentMethod = (type: string): type is DuePaymentMethod => {
  return PAYMENT_METHOD_OPTIONS.some((option) => option.id === type);
};

/** Check if recipient is a Bridge recipient that needs migration */
const needsMigration = (recipient: RecipientAPI): boolean => {
  // Legacy Bridge recipients have type 'usd' or 'eur'
  // Due Network recipients have types like 'usd_ach', 'eur_sepa', etc.
  return recipient.type === 'usd' || recipient.type === 'eur';
};

/** Build account data for EADetails based on recipient type */
const buildAccountData = (
  recipient: RecipientAPI,
  details?: RecipientAPIBankDetailed
) => {
  // Handle Due Network recipients
  if (isDuePaymentMethod(recipient.type)) {
    const dueRecipient = details?.dueRecipient;
    return {
      name: recipient.label,
      type: recipient.type,
      accountNumberLast4: recipient.detail,
      iban: dueRecipient?.details?.IBAN,
      swiftCode: dueRecipient?.details?.swiftCode,
      routingNumber: dueRecipient?.details?.routingNumber,
    };
  }

  // Handle legacy Bridge USD
  if (recipient.type === 'usd') {
    return {
      name: recipient.label,
      type: recipient.type,
      accountNumberLast4: details?.externalAccount?.account?.last_4 ?? '',
      routingNumber: details?.externalAccount?.account?.routing_number ?? '',
      accountType:
        details?.externalAccount?.account?.checking_or_savings ?? 'checking',
      bankName: details?.externalAccount?.bank_name ?? '',
    };
  }

  // Handle crypto
  if (recipient.type === 'crypto') {
    return {
      name: recipient.label,
      type: recipient.type,
      walletAddress: recipient.detail,
    };
  }

  // Handle legacy Bridge EUR
  return {
    name: recipient.label,
    type: recipient.type,
    accountNumberLast4: recipient.detail,
    country: details?.externalAccount?.iban?.country ?? '',
    bic: details?.externalAccount?.iban?.bic ?? '',
  };
};

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

  // Migration sheet state
  const [migrationSheetOpen, setMigrationSheetOpen] = useState(false);

  // TODO: Add a loading and error state to EADetails to accompany this
  const { data: details, refetch: refetchDetails } = useRecipientDetails(
    recipient?.id ?? '',
    {
      enabled: recipient && recipient.type !== 'crypto',
    }
  );

  const { data: transfers, isLoading: transfersLoading } =
    useRecipientTransfers(recipient?.id ?? '', {
      enabled: !!recipient && !isMobile,
    });

  // Handle send - check if migration is needed
  const handleSend = () => {
    if (recipient && needsMigration(recipient)) {
      // Open migration sheet instead of send flow
      setMigrationSheetOpen(true);
    } else {
      onSend?.();
    }
  };

  // Handle successful migration
  const handleMigrationSuccess = () => {
    // Refetch recipient details to get updated data
    refetchDetails();
    // Close the migration sheet (details sheet stays open)
  };

  if (!recipient) return null;
  // Allow deletion for crypto and Due Network recipients
  const isDeleteDisabled =
    recipient.type !== 'crypto' && !isDuePaymentMethod(recipient.type);

  // Check if this is a Bridge recipient that needs migration
  const requiresMigration = needsMigration(recipient);

  return (
    <>
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
              <EADetails account={buildAccountData(recipient, details)} />
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
                <Button variant='sorbet' onClick={handleSend} className='w-full'>
                  {requiresMigration ? 'Update & Send funds' : 'Send funds'}
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
                <Button variant='sorbet' onClick={handleSend} className='flex-1'>
                  {requiresMigration ? 'Update & Send funds' : 'Send funds'}
                </Button>
              </div>
            )}
          </VaulSheetFooter>
        </VaulSheetContent>
      </VaulSheet>

      {/* Migration Sheet */}
      <MigrateRecipientSheet
        open={migrationSheetOpen}
        setOpen={setMigrationSheetOpen}
        recipient={recipient}
        recipientDetails={details ?? null}
        onSuccess={handleMigrationSuccess}
      />
    </>
  );
};
