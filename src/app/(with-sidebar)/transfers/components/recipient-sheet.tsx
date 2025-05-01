import { ArrowLeft } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { BaseAlert } from '@/components/common/base-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { BankForm, BankFormValues } from './bank-form';
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
  VaulSheetTrigger,
} from './vaul-sheet';

/** Render a sheet to walk the user through new recipient creation */
export const RecipientSheet = ({
  onSubmit,
}: {
  onSubmit: (values: BankFormValues /* | CryptoFormValues */) => void;
}) => {
  const [step, setStep] = useState<'crypto' | 'bank'>();

  return (
    <VaulSheet onClose={() => setStep(undefined)}>
      <VaulSheetTrigger>Open</VaulSheetTrigger>
      <VaulSheetContent className='max-w-sm'>
        {step ? (
          step === 'crypto' ? (
            <CryptoRecipientStep
              onBack={() => setStep(undefined)}
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
  onSubmit: (values: BankFormValues) => void;
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
      <VaulSheetFooter className='flex flex-row justify-end'>
        <Button variant='sorbet' className='w-fit'>
          Save
        </Button>
      </VaulSheetFooter>
    </>
  );
};

const CryptoRecipientStep = ({
  onBack,
  className,
}: {
  onBack?: () => void;
  className?: string;
}) => {
  return (
    <>
      <VaulSheetHeader>
        <BackButton onClick={onBack} />
        <VaulSheetTitle>New crypto recipient</VaulSheetTitle>
      </VaulSheetHeader>
      <div className={cn('flex flex-col gap-3', className)}>
        <BaseAlert
          title='Is this a Base network address?'
          description='Make sure this address can accept USDC on Base. If not, you could lose your funds.'
        />
        <Label>Label</Label>
        <Input placeholder='A name to remember this wallet by' />
        <Label>Wallet address</Label>
        <Input placeholder='0x...' />
      </div>
      <VaulSheetFooter className='flex flex-row justify-end'>
        <Button variant='sorbet' className='w-fit'>
          Save
        </Button>
      </VaulSheetFooter>
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
