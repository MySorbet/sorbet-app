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
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  FieldErrors,
  useForm,
  UseFormReturn,
  useFormState,
} from 'react-hook-form';
import useMeasure from 'react-use-measure';
import { z } from 'zod';

import { USDCToUSD } from '@/app/wallet/usdc-to-usd-conversion';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';

interface WalletSendDialogProps {
  /** The element that triggers the modal to open */
  sendUSDC: (
    amount: string,
    recipientWalletAddress: string
  ) => Promise<`0x${string}` | undefined>;
  open: boolean;
  setOpen: (open: boolean) => void;
  usdcBalance: string;
}

type FormSchema = { amount: string; recipientWalletAddress: string };

/**
 * This dialog is triggered when a user wants to send from their Privy wallet. Currently only functional for USDCc
 */
export const WalletSendDialog = ({
  sendUSDC,
  open,
  setOpen,
  usdcBalance,
}: WalletSendDialogProps) => {
  const [step, setStep] = useState<number>(1);

  const [contentRef, { height: contentHeight }] = useMeasure();

  const { toast } = useToast();

  const formSchema = z.object({
    amount: z
      .string()
      .min(1, { message: 'An amount must be entered' })
      .refine((amount) => isAmountWithinBalance(amount, usdcBalance), {
        message: 'Amount entered exceeds available balance',
      })
      .refine((amount) => Number(amount) > 0, {
        message: 'Amount must be greater than 0',
      }),
    // No message here bc there are issues w the form animation height change on the first screen
    // The label should describe what the input should be (that was the design for NEAR wallet)
    // On input error, there is a red ring and border that shows up
    recipientWalletAddress: z
      .string()
      .max(42)
      .refine((walletAddress) => isValidETHAddress(walletAddress)),
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
      ethers.getAddress(address);
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
  const { data: rate } = USDCToUSD();
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
      toast({
        title: 'Transaction failed',
        description: 'Failed to send USDC',
        variant: 'destructive',
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
      <DialogContent
        className='w-[460px] rounded-[32px] p-0 sm:rounded-[32px]'
        hideDefaultCloseButton={true}
      >
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
                  usdcBalance={usdcBalance}
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
                        className='py-6 pr-28 text-2xl font-semibold placeholder:text-[#D0D5DD]'
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
                      <FormMessage className='text-xs font-semibold'>
                        {errors.amount.message}
                      </FormMessage>
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
                    />
                  </FormControl>
                  <FormDescription className='text-sm font-normal text-[#667085]'>
                    Please add a valid Ethereum wallet address
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <Button
            className='bg-sorbet border-sorbet-border mt-4 w-full border'
            type='submit'
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
          <Image src='/svg/logo.svg' height={48} width={48} alt='Sorbet logo' />
          <div className='flex max-w-[calc(100%-58px)] flex-col justify-between'>
            <span className='text-sm font-medium text-[#344054]'>Sorbet</span>
            <p className='text-sorbet w-full truncate text-lg'>
              {recipientWalletAddress}
            </p>
          </div>
        </div>
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
const Step3 = ({
  // TODO: Update this with the proper transactionId from the sendTransaction call
  transactionHash,
  close,
}: Step3Props) => {
  const basescanHref = env.NEXT_PUBLIC_TESTNET
    ? `https://sepolia.basescan.org/tx/${transactionHash}`
    : `https://basescan.org/tx/${transactionHash}`;

  const router = useRouter();
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
