'use client';

import { ArrowLeft } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
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
export const RecipientSheet = ({
  onSubmit,
  open = false,
  setOpen,
}: {
  onSubmit?: (
    values:
      | BankRecipientFormValuesWithRequiredValues
      | CryptoRecipientFormValues
  ) => Promise<void>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<'crypto' | 'bank'>();

  return (
    <VaulSheet open={open} onOpenChange={setOpen}>
      <VaulSheetContent
        className='max-w-sm'
        onAnimationEnd={() => !open && setStep(undefined)}
      >
        {step ? (
          step === 'crypto' ? (
            <CryptoRecipientStep
              onBack={() => setStep(undefined)}
              onSubmit={onSubmit}
              className='animate-in fade-in-0 slide-in-from-right-1 duration-300'
            />
          ) : (
            <BankRecipientStep
              onSubmit={onSubmit}
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
      <ScrollArea className='size-full flex-1'>
        <div className={cn('flex flex-col gap-3', className)}>
          <RecipientButton
            onClick={() => setStep('bank')}
            aria-label='Bank recipient'
            disabled={!isVerified}
          >
            <RecipientButtonIcon type='bank' />
            <RecipientButtonContent>
              <RecipientButtonTitle>Bank recipient</RecipientButtonTitle>
              <RecipientButtonDescription>
                Transfer to a business or individual bank
              </RecipientButtonDescription>
              <RecipientButtonDetail>
                Arrives in 1-2 business days
              </RecipientButtonDetail>
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
        <ScrollArea className='size-full flex-1'>
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
        <ScrollArea className='size-full flex-1'>
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
