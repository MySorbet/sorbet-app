import { CheckCircle, LinkExternal02, X } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SorbetSvg from '~/svg/logo.svg';
import USDCSvg from '~/svg/usdc.svg';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WalletSendDialogProps {
  isOpen: boolean;
  initialStep?: number;
}

/**
 * This dialog is triggered when a user wants to send from their Privy wallet. Currently only functional for USDCc
 */
export const WalletSendDialog = ({
  isOpen,
  initialStep = 1,
}: WalletSendDialogProps) => {
  const [step, setStep] = useState<number>(initialStep);
  const [amount, setAmount] = useState<number>(0);
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className='w-[460px] gap-6 rounded-[32px] p-6 sm:rounded-[32px]'
        hideDefaultCloseButton={true}
      >
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 amount={amount} />}
        {step === 3 && <Step3 />}
      </DialogContent>
    </Dialog>
  );
};

interface ScreenProps {
  setStep?: Dispatch<SetStateAction<number>>;
}

// Initial screen to get amount to send USDC from Privy wallet
const Step1 = () => {
  const conversion = 0.0;
  const available = 1.2345;

  return (
    <>
      <DialogHeader className='flex w-full flex-row justify-between'>
        <DialogTitle className='text-3xl leading-[38px] text-[#101828]'>
          Send
        </DialogTitle>
        <X className='size-6 text-[#98A2B3]' />
      </DialogHeader>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-[6px]'>
          <Label className='text-sm font-normal text-[#344054]'>Amount</Label>
          <div className='relative'>
            <Input
              placeholder='0.0'
              className='py-6 pr-28 text-2xl font-semibold placeholder:text-[#D0D5DD]'
              type='number'
            />
            <Button className='text-sorbet absolute right-[70px] top-[6px] bg-transparent p-0 text-base font-semibold hover:scale-105 hover:bg-transparent'>
              MAX
            </Button>
            <span className='absolute right-3 top-[14px] text-base font-semibold text-[#D0D5DD]'>
              USDC
            </span>
          </div>
          <div className='flex justify-between'>
            <Label className='text-xs font-semibold text-[#667085]'>
              ~ {conversion} USD
            </Label>
            <Label className='flex gap-1 text-xs font-semibold text-[#667085]'>
              <span className='font-normal'>Available</span>
              <span className='font-semibold text-[#344054]'>{available}</span>
            </Label>
          </div>
        </div>
        <div className='flex flex-col gap-[6px]'>
          <Label className='text-sm font-normal text-[#344054]'>Send to</Label>
          <Input />
          <Label className='text-sm font-normal text-[#667085]'>
            The account ID must be valid such as.near or contain exactly 64
            characters
          </Label>
        </div>
      </div>
      <Button className='bg-sorbet border-sorbet-border border'>
        Continue
      </Button>
    </>
  );
};

interface Step2Props extends ScreenProps {
  amount?: number;
  destination?: string;
}

// Confirmation Screen
const Step2 = ({ amount, destination }: Step2Props) => {
  return (
    <>
      <DialogHeader className='flex w-full flex-row justify-between'>
        <DialogTitle className='text-3xl leading-[38px] text-[#101828]'>
          Confirm Send
        </DialogTitle>
        <X className='size-6 text-[#98A2B3]' />
      </DialogHeader>
      <div className='flex flex-col items-center gap-6'>
        <div className='flex w-full flex-col items-center justify-center gap-[10px] rounded-2xl bg-[#FAFAFA] py-6'>
          <span className='text-3xl font-bold leading-[38px]'>{amount}</span>
          <div className='flex flex-row items-center gap-1'>
            <Image src={USDCSvg} height={20} width={20} alt='USDC logo' />
            <span className='text-sm font-medium text-[#344054]'>USDC</span>
          </div>
        </div>
        <span className='text-sm font-medium text-[#344054]'>To</span>
        <div className='flex w-full items-center justify-center gap-[10px] rounded-2xl bg-[#FAFAFA] py-6'>
          <Image src={SorbetSvg} height={48} width={48} alt='Sorbet logo' />
          <div className='flex flex-col justify-between'>
            <span className='text-sm font-medium text-[#344054]'>Sorbet</span>
            <span className='text-sorbet text-lg'>{destination}test</span>
          </div>
        </div>
      </div>
      <Button className='bg-sorbet border-sorbet-border mt-4 border text-base'>
        Send
      </Button>
    </>
  );
};

interface Step3Props extends ScreenProps {
  transactionId?: string;
}

// Results screen either success or failure
const Step3 = ({
  transactionId = '23sdbdf824b3b383b3c9AS24534BSUDsadasd',
}: Step3Props) => {
  return (
    <>
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
        {/* //TODO: Have this link to the transaction hash on basescan */}
        <a className='hover:decoration-sorbet flex flex-row items-center gap-1 hover:cursor-pointer hover:underline'>
          <span className='text-sorbet truncate text-sm'>{transactionId}</span>
          <LinkExternal02 className='size-4 text-[#595B5A]' />
        </a>
      </div>
      <Button className='bg-sorbet border-sorbet-border mt-4 border'>
        Done
      </Button>
    </>
  );
};
