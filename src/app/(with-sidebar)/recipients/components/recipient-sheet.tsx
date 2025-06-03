'use client';

import { Pencil, Trash2 } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { Spinner } from '@/components/common/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

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

  if (!recipient) return null;
  const isDeleteDisabled = recipient.type != 'crypto';

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
      direction={direction}
    >
      <VaulSheetContent direction={direction}>
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
              disabled={isDeleting || isDeleteDisabled}
            >
              {isDeleting ? <Spinner /> : <Trash2 />}
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <Button variant='secondary' disabled>
                  <Pencil />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top' sideOffset={8}>
                Editing recipients is not currently supported. Please delete and
                add a new recipient.
              </TooltipContent>
            </Tooltip>
            <Button variant='sorbet' onClick={onSend} className='flex-1'>
              Send funds
            </Button>
          </VaulSheetFooter>
        </BankRecipientFormContext>
      </VaulSheetContent>
    </VaulSheet>
  );
};
