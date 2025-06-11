'use client';

import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';

import { isCryptoFormValues } from '@/app/(with-sidebar)/recipients/components/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import {
  BankRecipientFormContext,
  BankRecipientFormValuesWithRequiredValues,
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
  onSubmit?: (
    values:
      | { type: 'usd'; values: BankRecipientFormValuesWithRequiredValues }
      | { type: 'crypto'; values: CryptoRecipientFormValues }
  ) => Promise<void>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<'crypto' | 'bank' | undefined>();
  const handleSubmit = async (
    values:
      | BankRecipientFormValuesWithRequiredValues
      | CryptoRecipientFormValues
  ) => {
    if (isCryptoFormValues(values)) {
      return await onSubmit?.({ type: 'crypto', values });
    } else {
      return await onSubmit?.({ type: 'usd', values });
    }
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
  // TODO: What we really need to do here is disable USD or EUR recipient creation according to endorsement status.
  const isVerified = useIsVerified();

  // Temporary UX to ship recipients as is
  const router = useRouter();
  const handleBankClick = () => {
    if (isVerified) {
      setStep('bank');
    } else {
      router.push('/verify');
    }
  };
  const bankDetail = isVerified ? (
    'Arrives in 1-2 business days'
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
      <ScrollArea className='overflow-y-auto'>
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
              <RecipientButtonDetail>Arrives instantly</RecipientButtonDetail>
            </RecipientButtonContent>
          </RecipientButton>
        </div>
      </ScrollArea>
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
  onSubmit?: (
    values: BankRecipientFormValuesWithRequiredValues
  ) => Promise<void>;
}) => {
  return (
    <>
      <VaulSheetHeader>
        <BackButton onClick={onBack} />
        <VaulSheetTitle>New bank recipient</VaulSheetTitle>
      </VaulSheetHeader>
      <BankRecipientFormContext>
        <ScrollArea className='overflow-y-auto'>
          <div className={className}>
            <NakedBankRecipientForm onSubmit={onSubmit} />
          </div>
        </ScrollArea>
        <VaulSheetFooter className='flex flex-row justify-end'>
          <BankRecipientSubmitButton />
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
        <ScrollArea className='overflow-y-auto'>
          <CryptoRecipientForm className={className} onSubmit={onSubmit} />
        </ScrollArea>
        <VaulSheetFooter className='flex flex-row justify-end'>
          <CryptoRecipientSubmitButton />
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
