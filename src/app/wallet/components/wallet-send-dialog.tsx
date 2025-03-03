import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import {
  ArrowNarrowLeft,
  CheckCircle,
  LinkExternal02,
  Loading02,
  X,
} from '@untitled-ui/icons-react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  FieldErrors,
  useForm,
  UseFormReturn,
  useFormState,
} from 'react-hook-form';
import useMeasure from 'react-use-measure';
import { toast } from 'sonner';
import { z } from 'zod';

import { BaseAlert } from '@/components/common/base-alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { env } from '@/lib/env';

import { useUSDCToUSD } from '../hooks/use-usdc-to-usd';

interface WalletSendDialogProps {
  /** The element that triggers the modal to open */
  sendUSDC: (
    amount: string,
    recipientWalletAddress: string
  ) => Promise<`0x${string}` | undefined>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type FormSchema = { amount: string; recipientWalletAddress: string };

/**
 * This dialog is triggered when a user wants to send from their Privy wallet. Currently only functional for USDCc
 */
export const WalletSendDialog = ({
  sendUSDC,
  open,
  setOpen,
}: WalletSendDialogProps) => {
  const [step, setStep] = useState<number>(1);

  const [contentRef] = useMeasure();

  const { data: walletBalance } = useWalletBalance();

  const formSchema = z.object({
    amount: z
      .string()
      .min(1, { message: 'An amount must be entered' })
      .refine(
        (amount) =>
          walletBalance && isAmountWithinBalance(amount, walletBalance),
        {
          message: 'Amount entered exceeds available balance',
        }
      )
      .refine((amount) => Number(amount) > 0, {
        message: 'Amount must be greater than 0',
      }),
    // No message here bc there are issues w the form animation height change on the first screen
    // The label should describe what the input should be (that was the design for NEAR wallet)
    // On input error, there is a red ring and border that shows up
    recipientWalletAddress: z
      .string()
      .max(42, { message: 'Must be a valid ETH address' })
      .refine((walletAddress) => isValidETHAddress(walletAddress), {
        message: 'Must be a valid ETH address',
      }),
  });

  /**
   * function that checks if a user types in a balance that exceeds the amount available.
   * Used in zod schema declaration.
   */
  const isAmountWithinBalance = (amount: string, amountAvailable: string) => {
    if (Number(amount) > Number(amountAvailable)) return false;
    return true;
  };

  /**
   * function that checks if an inputted wallet address is a valid ETH address.
   * Used in zod schema declaration.
   */
  const isValidETHAddress = (address: string) => {
    try {
      ethers.utils.getAddress(address);
    } catch (error: unknown) {
      return false;
    }
    return true;
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      recipientWalletAddress: '',
    },
    mode: 'all',
  });

  const { errors, isValid } = useFormState({ control: form.control });

  const amount = form.watch('amount');
  const recipientWalletAddress = form.watch('recipientWalletAddress');

  // Perhaps we only want to run this fetch request once...
  const { data: rate } = useUSDCToUSD();
  const convertedUSD = String(rate * Number(amount || 0));

  const {
    data: transactionHash,
    mutateAsync: sendTransactionMutation,
    isPending: sendTransactionLoading,
  } = useMutation({
    mutationFn: async () => {
      setOpen(false);
      return await sendUSDC(amount, recipientWalletAddress);
    },
    onError: (error: unknown) => {
      if (
        error instanceof Error &&
        'details' in error &&
        typeof error.details === 'object' &&
        error.details !== null &&
        'message' in error.details &&
        error.details.message === 'User Rejected Request'
      ) {
        setOpen(true);
        return;
      }
      toast.error('Transaction failed', {
        description: 'Failed to send USDC',
      });
    },
    onSuccess: () => {
      setStep(3);
      setOpen(true);
    },
  });

  const close = () => {
    setOpen(false);
    form.reset();
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-[460px] rounded-2xl p-0' hideClose>
        <motion.div
          // TODO: Come up with a solution for animating the height changes. Still having issues with the first render not being calculated correctly by useMeasure.
          // TODO: Tried passing an anonymous function instead of reference, still didn't work. Was thinking of potentially creating a piece of state (boolean) to represent if the modal was just opened,
          // TODO: and then changing it on each action, but that is not clean and hard to maintain.
          // * As it stands, the only two screens that would ever be rendered for the first time are Step1 and Step2
          // * Step1 via clicking on Send button and Step2 when a user closes the Privy modal
          className='overflow-hidden'
        >
          <div ref={contentRef}>
            {step === 1 && (
              <FadeIn>
                <Step1
                  close={close}
                  setStep={setStep}
                  usdcBalance={walletBalance ?? ''}
                  convertedUSD={convertedUSD}
                  form={form}
                  isValid={isValid}
                  errors={errors}
                />
              </FadeIn>
            )}
            {step === 2 && (
              <FadeIn>
                <Step2
                  close={() => setOpen(false)}
                  amount={amount}
                  setStep={setStep}
                  recipientWalletAddress={recipientWalletAddress}
                  sendTransactionLoading={sendTransactionLoading}
                  sendTransactionMutation={sendTransactionMutation}
                />
              </FadeIn>
            )}
            {step === 3 && (
              <FadeIn>
                <Step3
                  close={close}
                  setStep={setStep}
                  transactionHash={transactionHash}
                />
              </FadeIn>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

interface ScreenProps {
  setStep: Dispatch<SetStateAction<number>>;
  close: () => void;
}

interface Step1Props extends ScreenProps {
  usdcBalance: string;
  convertedUSD: string;
  form: UseFormReturn<FormSchema>;
  isValid: boolean;
  errors: FieldErrors<FormSchema>;
}

/**
 * Initial screen to get amount to send USDC from Privy wallet
 */
const Step1 = ({
  close,
  setStep,
  usdcBalance,
  convertedUSD,
  form,
  isValid,
  errors,
}: Step1Props) => {
  const handleSubmit = () => {
    setStep(2);
  };

  return (
    <div className='flex flex-col gap-6 p-6'>
      <DialogHeader className='flex w-full flex-row justify-between'>
        <DialogTitle className='text-3xl leading-[38px] text-[#101828]'>
          Send
        </DialogTitle>
        <VisuallyHidden asChild>
          <DialogDescription>
            Send USDC from your Sorbet wallet
          </DialogDescription>
        </VisuallyHidden>
        <button
          className='group m-0 bg-transparent p-0 hover:bg-transparent'
          onClick={close}
        >
          <X className='size-6 text-[#98A2B3] ease-out group-hover:scale-110' />
        </button>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col gap-6'>
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-[6px] space-y-0'>
                  <FormLabel className='text-sm font-normal text-[#344054]'>
                    Amount
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        placeholder='0.0'
                        className='no-spin-buttons py-6 pr-28 text-2xl font-semibold placeholder:text-[#D0D5DD]'
                        type='number'
                        autoFocus
                      />
                      <Button
                        className='text-sorbet absolute right-[70px] top-[6px] bg-transparent p-0 text-base font-semibold hover:scale-105 hover:bg-transparent'
                        onClick={(e) => {
                          e.preventDefault();
                          form.setValue('amount', usdcBalance);
                        }}
                      >
                        MAX
                      </Button>
                      <span className='absolute right-3 top-[14px] text-base font-semibold text-[#D0D5DD]'>
                        USDC
                      </span>
                    </div>
                  </FormControl>
                  <div className='flex justify-between'>
                    {errors.amount ? (
                      <FormMessage>{errors.amount.message}</FormMessage>
                    ) : (
                      <FormLabel className='text-xs font-semibold text-[#667085]'>
                        ~ {Math.round(Number(convertedUSD))} USD
                      </FormLabel>
                    )}
                    <FormLabel className='flex gap-1 text-xs font-semibold text-[#667085]'>
                      <span className='font-normal'>Available</span>
                      <span className='font-semibold text-[#344054]'>
                        {usdcBalance} USDC
                      </span>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='recipientWalletAddress'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-[6px] space-y-0'>
                  <FormLabel className='text-sm font-normal text-[#344054]'>
                    Send to
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      placeholder='0x...'
                      className={
                        errors.recipientWalletAddress &&
                        'border border-red-500 focus-visible:ring-red-500'
                      }
                      spellCheck={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <BaseAlert
              title='Is this a Base network address?'
              description='Make sure this address can accept USDC on Base. If not, you could lose your funds.'
            />
          </div>
          <Button
            className='mt-6 w-full'
            type='submit'
            variant='sorbet'
            disabled={!isValid}
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

interface Step2Props extends ScreenProps {
  amount: string;
  recipientWalletAddress: string;
  sendTransactionMutation: UseMutateAsyncFunction<
    `0x${string}` | undefined,
    unknown,
    void,
    unknown
  >;
  sendTransactionLoading: boolean;
}

/**
 * Confirmation screen with option to go back
 */
const Step2 = ({
  close,
  amount,
  recipientWalletAddress,
  setStep,
  sendTransactionLoading,
  sendTransactionMutation,
}: Step2Props) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <DialogHeader className='flex w-full flex-row justify-between'>
        <DialogTitle className='text-3xl leading-[38px] text-[#101828]'>
          Confirm Send
        </DialogTitle>
        <VisuallyHidden asChild>
          <DialogDescription>
            Confirm the details of the transaction
          </DialogDescription>
        </VisuallyHidden>
        <button
          className='group m-0 bg-transparent p-0 hover:bg-transparent'
          onClick={close}
        >
          <X className='size-6 text-[#98A2B3] ease-out group-hover:scale-110' />
        </button>
      </DialogHeader>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex w-full flex-col items-center justify-center gap-[10px] rounded-2xl bg-[#FAFAFA] py-6'>
          <span className='text-3xl font-bold leading-[38px]'>{amount}</span>
          <div className='flex flex-row items-center gap-1'>
            <Image src='/svg/usdc.svg' height={20} width={20} alt='USDC logo' />
            <span className='text-sm font-medium text-[#344054]'>USDC</span>
          </div>
        </div>
        <span className='text-sm font-medium text-[#344054]'>To</span>
        <div className='flex w-full items-center justify-center gap-[10px] rounded-2xl bg-[#FAFAFA] px-4 py-6'>
          <p className='text-md w-full truncate'>{recipientWalletAddress}</p>
        </div>
        <BaseAlert
          title='Is this a Base network address?'
          description='Make sure this address can accept USDC on Base. If not, you could lose your funds.'
        />
      </div>
      <div className='mt-4 flex gap-3'>
        <Button
          onClick={() => setStep(1)}
          className='group flex items-center gap-[6px] border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#FAFAFA]'
        >
          <ArrowNarrowLeft className='size-3 text-[#344054] transition ease-out group-hover:translate-x-[-1px]' />
          Go back
        </Button>
        <Button
          className='bg-sorbet border-sorbet-border w-full border text-base'
          onClick={() => {
            sendTransactionMutation();
          }}
        >
          {sendTransactionLoading ? (
            <Loading02 className='animate-spin' />
          ) : (
            'Confirm send'
          )}
        </Button>
      </div>
    </div>
  );
};

interface Step3Props extends ScreenProps {
  /** Transaction hash returned from the sendTransaction function via RQ mutation hook */
  transactionHash: string | undefined;
}

/**
 * Final screen showing success and a link to basescan for transaction hash
 */
const Step3 = ({ transactionHash, close }: Step3Props) => {
  const basescanHref = env.NEXT_PUBLIC_TESTNET
    ? `https://sepolia.basescan.org/tx/${transactionHash}`
    : `https://basescan.org/tx/${transactionHash}`;

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex flex-col items-center justify-center gap-[10px] py-6'>
        <CheckCircle className='size-[53px] text-[#17B26A]' />
        <span className='text-3xl font-bold leading-[38px] text-[#17B26A]'>
          Successful
        </span>
      </div>
      <div className='flex flex-col items-center justify-center rounded-2xl bg-[#FAFAFA] px-4 py-6'>
        <span className='text-sm font-medium text-[#344054]'>
          Transaction ID
        </span>
        {/* //TODO: Have this link to the transaction hash on basescan (all we need to do is redirect the href link with the proper transaction hash) */}
        <a
          className='hover:decoration-sorbet flex max-w-[calc(100%-40px)] flex-row items-center gap-1 hover:cursor-pointer hover:underline'
          target='_blank'
          rel='noopener noreferrer'
          href={basescanHref}
        >
          <span className='text-sorbet truncate text-sm'>
            {transactionHash}
          </span>
          <LinkExternal02 className='size-6 text-[#595B5A]' />
        </a>
      </div>
      <Button
        className='bg-sorbet border-sorbet-border mt-4 w-full border'
        onClick={close}
      >
        Done
      </Button>
    </div>
  );
};

/** All this does is animate the opacity of each component and adds a delay for better timing */
const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
};
