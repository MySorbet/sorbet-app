'use client';

import { Info } from 'lucide-react';

import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQRCode } from '@/hooks/profile/use-qr-code';
import { formatWalletAddress } from '@/lib/utils';

export const StellarActivationDialog = ({
  open,
  onOpenChange,
  stellarAddress,
  onRetrySwitch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stellarAddress: string;
  onRetrySwitch: () => void;
}) => {
  const { qrCodeRef, isLoadingQRCode } = useQRCode(stellarAddress);

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className='p-0 md:max-w-sm'>
        <div className='flex flex-col gap-4 p-6'>
          <div className='flex flex-col gap-1'>
            <CredenzaTitle className='text-xl font-semibold text-[#101828]'>
              Activate your Stellar wallet
            </CredenzaTitle>
            <CredenzaDescription className='text-sm text-[#667085]'>
              Your Stellar account exists in Privy but is not active on-chain yet.
            </CredenzaDescription>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm text-[#667085]'>Address</span>
            <CopyButton
              stringToCopy={stellarAddress}
              variant='ghost'
              className='h-auto gap-1 p-0 text-sm font-medium text-[#344054] hover:bg-transparent'
              copyIconClassName='size-4 text-[#98A2B3]'
            >
              {formatWalletAddress(stellarAddress)}
            </CopyButton>
          </div>

          <div className='flex items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-6'>
            {isLoadingQRCode ? <Skeleton className='size-48' /> : <div ref={qrCodeRef} />}
          </div>

          <div className='flex items-start gap-2 rounded-lg border border-[#E4E4E7] bg-[#F9FAFB] p-3'>
            <Info className='mt-0.5 size-4 shrink-0 text-[#3B82F6]' />
            <p className='text-sm text-[#344054]'>
              Send at least <span className='font-semibold'>2.5 XLM</span> to this
              address to activate your Stellar account. Then come back and try again.
            </p>
          </div>

          <div className='flex gap-3'>
            <BackButton onClick={() => onOpenChange(false)}>Close</BackButton>
            <Button className='flex-1' onClick={onRetrySwitch}>
              I funded it, try again
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};

