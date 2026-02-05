'use client';

import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';

import { CreateRecipientDto } from '@/api/recipients/types';
import { isCryptoFormValues } from '@/app/(with-sidebar)/recipients/components/utils';
import { PAYMENT_TIMING_DESCRIPTIONS } from '@/app/invoices/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
import { useMyChain } from '@/hooks/use-my-chain';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { useEndorsements } from '../hooks/use-endorsements';
import {
  BankRecipientFormContext,
  BankRecipientFormValues,
  BankRecipientSubmitButton,
  NakedBankRecipientForm,
} from './bank-recipient-form';
import {
  CryptoRecipientForm,
  CryptoRecipientFormContext,
  CryptoRecipientFormValues,
  CryptoRecipientSubmitButton,
} from './crypto-recipient-form';
import {
  RecipientButton,
  RecipientButtonContent,
  RecipientButtonDescription,
  RecipientButtonDetail,
  RecipientButtonIcon,
  RecipientButtonTitle,
} from './recipient-button';
import {
  VaulSheet,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetTitle,
} from './vaul-sheet';

/** Render a sheet to walk the user through new recipient creation */
export const AddRecipientSheet = ({
  onSubmit,
  open = false,
  setOpen,
}: {
  onSubmit?: (values: CreateRecipientDto) => Promise<void>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<'crypto' | 'bank' | undefined>();
  const { data: myChainData } = useMyChain();
  const currentChain = myChainData?.chain ?? 'base';

  const handleSubmit = async (
    values: BankRecipientFormValues | CryptoRecipientFormValues
  ) => {
    if (isCryptoFormValues(values)) {
      if (values.chain === 'base') {
        return await onSubmit?.({ chain: 'base', type: 'crypto_base', values });
      }
      return await onSubmit?.({ chain: 'stellar', type: 'crypto_stellar', values });
    }
    return await onSubmit?.({ chain: currentChain, type: values.currency, values });
  };

  const isMobile = useIsMobile();
  const direction = isMobile ? 'bottom' : 'right';
  return (
    <VaulSheet open={open} onOpenChange={setOpen} direction={direction}>
      <VaulSheetContent
        direction={direction}
        onAnimationEnd={() => !open && setStep(undefined)}
      >
        {step ? (
          step === 'crypto' ? (
            <CryptoRecipientStep
              onBack={() => setStep(undefined)}
              onSubmit={handleSubmit}
              className='animate-in fade-in-0 slide-in-from-right-1 duration-300'
            />
          ) : (
            <BankRecipientStep
              onSubmit={handleSubmit}
              onBack={() => setStep(undefined)}
              className='animate-in fade-in-0 slide-in-from-right-1 duration-300'
            />
          )
        ) : (
          <BankOrCrypto
            setStep={setStep}
            className='animate-in fade-in-0 slide-in-from-left-1 duration-300'
          />
        )}
      </VaulSheetContent>
    </VaulSheet>
  );
};

const BankOrCrypto = ({
  className,
  setStep,
}: {
  className?: string;
  setStep: (step: 'crypto' | 'bank') => void;
}) => {
  // Below, we set up a redirect to the verify page for unverified users
  // Eventually, we want to do an "inline verification" within the drawer or sheet
  const isVerified = useIsVerified();
  const router = useRouter();
  const handleBankClick = () => {
    if (isVerified) {
      setStep('bank');
    } else {
      router.push('/verify');
    }
  };
  const bankDetail = isVerified ? (
    PAYMENT_TIMING_DESCRIPTIONS.bank
  ) : (
    <div className='flex gap-1'>
      <ShieldCheck className='size-4' />
      <span>Get verified to add bank recipients</span>
    </div>
  );

  return (
    <>
      <VaulSheetHeader>
        {/* For spacing to be consistent */}
        <BackButton className='opacity-0' aria-hidden />
        <VaulSheetTitle>New recipient</VaulSheetTitle>
        <VaulSheetDescription>
          Select how you want to transfer funds
        </VaulSheetDescription>
      </VaulSheetHeader>
      <ScrollAreaHack>
        <div className={cn('flex flex-col gap-3', className)}>
          <RecipientButton
            onClick={handleBankClick}
            aria-label='Bank recipient'
          >
            <RecipientButtonIcon type='bank' />
            <RecipientButtonContent>
              <RecipientButtonTitle>Bank recipient</RecipientButtonTitle>
              <RecipientButtonDescription>
                Transfer to a business or individual bank
              </RecipientButtonDescription>
              <RecipientButtonDetail>{bankDetail}</RecipientButtonDetail>
            </RecipientButtonContent>
          </RecipientButton>
          <RecipientButton
            onClick={() => setStep('crypto')}
            aria-label='Crypto wallet'
          >
            <RecipientButtonIcon type='wallet' />
            <RecipientButtonContent>
              <RecipientButtonTitle>Crypto wallet</RecipientButtonTitle>
              <RecipientButtonDescription>
                Transfer to crypto wallet or exchange
              </RecipientButtonDescription>
              <RecipientButtonDetail>
                {PAYMENT_TIMING_DESCRIPTIONS.crypto}
              </RecipientButtonDetail>
            </RecipientButtonContent>
          </RecipientButton>
        </div>
      </ScrollAreaHack>
    </>
  );
};

const BankRecipientStep = ({
  onSubmit,
  onBack,
  className,
}: {
  onBack?: () => void;
  className?: string;
  onSubmit?: (values: BankRecipientFormValues) => Promise<void>;
}) => {
  const { isEurApproved } = useEndorsements();

  return (
    <>
      <VaulSheetHeader>
        <BackButton onClick={onBack} />
        <VaulSheetTitle>New bank recipient</VaulSheetTitle>
      </VaulSheetHeader>
      <BankRecipientFormContext>
        <ScrollAreaHack>
          <div className={className}>
            <NakedBankRecipientForm
              onSubmit={onSubmit}
              eurLocked={!isEurApproved}
            />
          </div>
        </ScrollAreaHack>
        <VaulSheetFooter>
          <BankRecipientSubmitButton className='w-full' />
        </VaulSheetFooter>
      </BankRecipientFormContext>
    </>
  );
};

const CryptoRecipientStep = ({
  onBack,
  className,
  onSubmit,
}: {
  onBack?: () => void;
  className?: string;
  onSubmit?: (values: CryptoRecipientFormValues) => Promise<void>;
}) => {
  return (
    <>
      <VaulSheetHeader>
        <BackButton onClick={onBack} />
        <VaulSheetTitle>New crypto recipient</VaulSheetTitle>
      </VaulSheetHeader>
      <CryptoRecipientFormContext>
        <ScrollAreaHack>
          <CryptoRecipientForm className={className} onSubmit={onSubmit} />
        </ScrollAreaHack>
        <VaulSheetFooter>
          <CryptoRecipientSubmitButton className='w-full' />
        </VaulSheetFooter>
      </CryptoRecipientFormContext>
    </>
  );
};

const BackButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & { className?: string }
>(({ className, onClick, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant='ghost'
      size='icon'
      className={cn('group -ml-1 size-6', className)}
      onClick={onClick}
      {...props}
    >
      <ArrowLeft className='transition-transform ease-in-out group-hover:-translate-x-[2px]' />
    </Button>
  );
});
BackButton.displayName = 'BackButton';

/**
 * This conditional style on a scroll area fixes a bug where
 * - on desktop, the classname would cause a double scrollbar
 * - on mobile, omitting the classname causes the content to be hidden since the parent eventually has h-auto
 */
const ScrollAreaHack = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <ScrollArea className={cn(isMobile && 'overflow-y-auto')}>
      {children}
    </ScrollArea>
  );
};
