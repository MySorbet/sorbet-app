import { EIP1193Provider, useWallets } from '@privy-io/react-auth';
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
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import useMeasure from 'react-use-measure';

import { USDCToUSD } from '@/app/wallet/USDCToUSDConversion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWalletBalances } from '@/hooks';

interface WalletSendDialogProps {
  initialStep?: number;
  trigger: ReactNode;
}

/**
 * This dialog is triggered when a user wants to send from their Privy wallet. Currently only functional for USDCc
 */
export const WalletSendDialog = ({ trigger }: WalletSendDialogProps) => {
  const [step, setStep] = useState<number>(1);
  const [amount, setAmount] = useState<string>('');
  const [contentRef, { height: contentHeight }] = useMeasure();
  const { data: rate } = USDCToUSD();
  const convertedUSD = String(rate * Number(amount));
  const [recipientWallet, setRecipientWallet] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<EIP1193Provider | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { ready, wallets } = useWallets();

  const { usdcBalance } = useWalletBalances(walletAddress);

  // Perhaps we only want to run this fetch request once...
  const {
    data: transactionData,
    mutateAsync: sendTransactionMutation,
    isPending: sendTransactionLoading,
  } = useMutation({
    mutationFn: async () => await sendTransaction,
  });

  async function sendTransaction() {
    if (!provider) {
      return;
    }
    // TODO: replace with proper recipient wallet address
    // TODO: look into to params object (to, value, data, gasLimit, etc)
    // https://docs.privy.io/guide/react/wallets/usage/requests#transactions
    const transactionRequest = {
      to: '0xTheRecipientAddress',
      value: 10,
    };
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest],
    });
  }

  useEffect(() => {
    async function initWalletProvider() {
      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();
      setProvider(provider);
    }
    // When Privy is done finding the user's wallets, we set walletAddress and provider pieces of state
    if (ready) {
      setWalletAddress(wallets[0].address);
      initWalletProvider();
    }
  }, [wallets, ready]);

  return (
    <Dialog
      onOpenChange={() => {
        // Reset the form state whenever the modal is closed
        setStep(1);
        setAmount('');
        setWalletAddress('');
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='w-[460px] rounded-[32px] p-0 sm:rounded-[32px]'
        hideDefaultCloseButton={true}
      >
        <motion.div
          // TODO: address this hacky solution for the first view. For some reason, the height is not being calculated correctly when the dialog is opened.
          animate={{
            height: step === 1 ? '424px' : contentHeight,
          }}
          className='overflow-hidden'
        >
          <div ref={contentRef}>
            {step === 1 && (
              <FadeIn>
                <Step1
                  amount={amount}
                  setStep={setStep}
                  usdcBalance={usdcBalance}
                  setAmount={setAmount}
                  convertedUSD={convertedUSD}
                  setRecipientWallet={setRecipientWallet}
                />
              </FadeIn>
            )}
            {step === 2 && (
              <FadeIn>
                <Step2
                  amount={amount}
                  setStep={setStep}
                  recipientWallet={recipientWallet}
                  sendTransactionLoading={sendTransactionLoading}
                  sendTransactionMutation={sendTransactionMutation}
                />
              </FadeIn>
            )}
            {step === 3 && (
              <FadeIn>
                <Step3 setStep={setStep} />
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
}

interface Step1Props extends ScreenProps {
  amount: string;
  usdcBalance: string;
  setAmount: Dispatch<SetStateAction<string>>;
  convertedUSD: string;
  setRecipientWallet: Dispatch<SetStateAction<string>>;
}

// Initial screen to get amount to send USDC from Privy wallet
const Step1 = ({
  setStep,
  usdcBalance,
  amount,
  setAmount,
  convertedUSD,
  setRecipientWallet,
}: Step1Props) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <DialogHeader className='flex w-full flex-row justify-between'>
        <DialogTitle className='text-3xl leading-[38px] text-[#101828]'>
          Send
        </DialogTitle>
        <DialogClose className='group fixed right-7'>
          <X className='size-6 text-[#98A2B3] ease-out group-hover:scale-110' />
        </DialogClose>
      </DialogHeader>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-[6px]'>
          <Label className='text-sm font-normal text-[#344054]'>Amount</Label>
          <div className='relative'>
            <Input
              placeholder='0.0'
              className='py-6 pr-28 text-2xl font-semibold placeholder:text-[#D0D5DD]'
              value={amount}
              type='number'
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              className='text-sorbet absolute right-[70px] top-[6px] bg-transparent p-0 text-base font-semibold hover:scale-105 hover:bg-transparent'
              onClick={() => setAmount(usdcBalance)}
            >
              MAX
            </Button>
            <span className='absolute right-3 top-[14px] text-base font-semibold text-[#D0D5DD]'>
              USDC
            </span>
          </div>
          <div className='flex justify-between'>
            <Label className='text-xs font-semibold text-[#667085]'>
              ~ {convertedUSD} USD
            </Label>
            <Label className='flex gap-1 text-xs font-semibold text-[#667085]'>
              <span className='font-normal'>Available</span>
              <span className='font-semibold text-[#344054]'>
                {usdcBalance} USDC
              </span>
            </Label>
          </div>
        </div>
        <div className='flex flex-col gap-[6px]'>
          <Label className='text-sm font-normal text-[#344054]'>Send to</Label>
          <Input onChange={(e) => setRecipientWallet(e.target.value)} />
          <Label className='text-sm font-normal text-[#667085]'>
            The account ID must be valid such as.near or contain exactly 64
            characters
          </Label>
        </div>
      </div>
      <Button
        className='bg-sorbet border-sorbet-border mt-4 w-full border'
        onClick={() => setStep(2)}
        // TODO: Add disabled condition for walletId. Just need to confirm w/ Rami what it should look like
        disabled={Number(amount) <= 0}
      >
        Continue
      </Button>
    </div>
  );
};

interface Step2Props extends ScreenProps {
  amount: string;
  recipientWallet: string;
  sendTransactionMutation: UseMutateAsyncFunction<
    () => Promise<void>,
    Error,
    void,
    unknown
  >;
  sendTransactionLoading: boolean;
}

// Confirmation Screen
const Step2 = ({
  amount,
  recipientWallet,
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
        <DialogClose className='group fixed right-7'>
          <X className='size-6 text-[#98A2B3] ease-out group-hover:scale-110' />
        </DialogClose>
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
        <div className='flex w-full items-center justify-center gap-[10px] rounded-2xl bg-[#FAFAFA] py-6'>
          <Image src='/svg/logo.svg' height={48} width={48} alt='Sorbet logo' />
          <div className='flex flex-col justify-between'>
            <span className='text-sm font-medium text-[#344054]'>Sorbet</span>
            <span className='text-sorbet text-lg'>{recipientWallet}</span>
          </div>
        </div>
      </div>
      <div className='mt-4 flex gap-3'>
        <Button
          onClick={() => setStep(1)}
          className='flex items-center gap-[6px] border border-[#D0D5DD] bg-white text-[#344054]'
        >
          <ArrowNarrowLeft className='size-3 text-[#344054]' />
          Go back
        </Button>
        <Button
          className='bg-sorbet border-sorbet-border w-full border text-base'
          onClick={() => setStep(3)}
        >
          {sendTransactionLoading ? (
            <Loading02 className='animate-spin' />
          ) : (
            'Send'
          )}
        </Button>
      </div>
    </div>
  );
};

interface Step3Props extends ScreenProps {
  transactionId?: string;
}

// Results screen either success or failure
const Step3 = ({
  // TODO: Update this with the proper transactionId from the sendTransaction call
  transactionId = '23sdbdf824b3b383b3c9AS24534BSUDsadasd',
}: Step3Props) => {
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
        <a className='hover:decoration-sorbet flex flex-row items-center gap-1 hover:cursor-pointer hover:underline'>
          <span className='text-sorbet truncate text-sm'>{transactionId}</span>
          <LinkExternal02 className='size-4 text-[#595B5A]' />
        </a>
      </div>
      <Button className='bg-sorbet border-sorbet-border mt-4 w-full border'>
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
