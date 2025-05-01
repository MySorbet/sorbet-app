import { ArrowLeft } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { BankForm, BankFormValues } from './bank-form';
import {
  CryptoRecipientForm,
  CryptoRecipientFormValues,
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
  VaulSheetHeader,
  VaulSheetTitle,
} from './vaul-sheet';

/** Render a sheet to walk the user through new recipient creation */
export const RecipientSheet = ({
  onSubmit,
  open = false,
  setOpen,
}: {
  onSubmit?: (values: BankFormValues | CryptoRecipientFormValues) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const [step, setStep] = useState<'crypto' | 'bank'>();

  const handleClose = () => {
    setStep(undefined);
  };

  return (
    <VaulSheet onClose={handleClose} open={open} onOpenChange={setOpen}>
      <VaulSheetContent className='max-w-sm'>
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
      <div className={cn('flex flex-col gap-3', className)}>
        <RecipientButton onClick={() => setStep('bank')}>
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
        <RecipientButton onClick={() => setStep('crypto')}>
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
  onSubmit?: (values: BankFormValues) => void;
}) => {
  return (
    <>
      <VaulSheetHeader>
        <BackButton onClick={onBack} />
        <VaulSheetTitle>New bank recipient</VaulSheetTitle>
      </VaulSheetHeader>
      <div className={className}>
        <BankForm onSubmit={onSubmit} />
      </div>
      {/* <VaulSheetFooter className='flex flex-row justify-end'>
        <Button variant='sorbet' className='w-fit'>
          Save
        </Button>
      </VaulSheetFooter> */}
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
  onSubmit?: (values: CryptoRecipientFormValues) => void;
}) => {
  return (
    <>
      <VaulSheetHeader>
        <BackButton onClick={onBack} />
        <VaulSheetTitle>New crypto recipient</VaulSheetTitle>
      </VaulSheetHeader>
      <CryptoRecipientForm className={className} onSubmit={onSubmit} />
      {/* <VaulSheetFooter className='flex flex-row justify-end'>
        <Button variant='sorbet' className='w-fit'>
          Save
        </Button>
      </VaulSheetFooter> */}
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
