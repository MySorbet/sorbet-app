'use client';

import { Trash2 } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { Spinner } from '@/components/common/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

import { BankRecipientFormContext } from './bank-recipient-form';
import {
  VaulSheet,
  VaulSheetContent,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetTitle,
} from './vaul-sheet';

/** Render a sheet to show recipient details */
export const RecipientSheet = ({
  open = false,
  setOpen,
  recipient,
  onAnimationEnd,
  onDelete,
  isDeleting,
}: {
  recipient?: RecipientAPI;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onAnimationEnd?: () => void;
  onDelete?: (recipientId: string) => void;
  isDeleting?: boolean;
}) => {
  if (!recipient) return null;
  const label =
    recipient.type === 'usd'
      ? 'Routing number'
      : recipient.type === 'eur'
      ? 'IBAN'
      : 'Address';
  return (
    <VaulSheet
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={onAnimationEnd}
    >
      <VaulSheetContent className='max-w-sm'>
        <VaulSheetHeader>
          <VaulSheetTitle>{recipient.label}</VaulSheetTitle>
          <Badge variant='secondary' className='w-fit'>
            {recipient.type}
          </Badge>
        </VaulSheetHeader>
        <BankRecipientFormContext>
          <ScrollArea className='size-full flex-1'>
            <div className='flex flex-col gap-2'>
              <Label>{label}</Label>
              <Input value={recipient.detail} disabled />
              <Label>Liquidates to</Label>
              <Input value={recipient.walletAddress} disabled />
            </div>
          </ScrollArea>
          <VaulSheetFooter className='flex flex-row justify-between gap-2'>
            <Button
              variant='secondary'
              onClick={() => {
                onDelete?.(recipient.id);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : <Trash2 />}
              {isDeleting ? 'Deleting...' : 'Delete'})
            </Button>
            <Button variant='sorbet' disabled>
              Edit
            </Button>
          </VaulSheetFooter>
        </BankRecipientFormContext>
      </VaulSheetContent>
    </VaulSheet>
  );
};
