import { Send01, Wallet03 } from '@untitled-ui/icons-react';
import { Plus } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

import { BalanceChart } from '@/app/wallet/balance-chart';
import { PercentageChange } from '@/app/wallet/percent-change';
import { SelectDuration } from '@/app/wallet/select-duration';
import { formatCurrency } from '@/app/wallet/utils';
import { WalletSendDialog } from '@/app/wallet/wallet-send-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCombinedBalance } from '@/hooks/wallet/useCombinedBalance';

interface WalletBalanceProps {
  usdcBalance: string;
  onTopUp?: () => void;
  sendUSDC: (
    amount: string,
    recipientWalletAddress: string
  ) => Promise<`0x${string}` | undefined>;
  isBalanceLoading: boolean;
  balanceHistoryIn: { date: string; balance: string }[] | undefined;
  balanceHistoryOut: { date: string; balance: string }[] | undefined;
  selectedDuration: string;
  onTxnDurationChange: Dispatch<SetStateAction<string>>;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  usdcBalance,
  onTopUp,
  sendUSDC,
  isBalanceLoading,
  selectedDuration,
  onTxnDurationChange,
  balanceHistoryIn,
  balanceHistoryOut,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const { percentChange, cumulativeBalanceHistory } = useCombinedBalance(
    usdcBalance,
    balanceHistoryIn,
    balanceHistoryOut
  );

  return (
    <div className='min-h-full rounded-3xl bg-white shadow-[0px_10px_30px_0px_#00000014]'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between p-6 pb-0'>
          <div>
            <div className='flex items-center gap-2'>
              <span className='rounded-full bg-black p-2 text-white'>
                <Wallet03 className='size-[1.125rem]' />
              </span>
              <span className='text-md font-medium text-[#595B5A]'>
                BALANCE
              </span>
              {percentChange !== 0 && (
                <PercentageChange percentChange={percentChange} />
              )}
            </div>
            <div className='mt-2 flex'>
              {isBalanceLoading ? (
                <Skeleton className='h-[30px] w-32 bg-gray-300 leading-[38px]' />
              ) : (
                <div className='text-3xl font-semibold'>
                  {formatCurrency(usdcBalance)} USDC
                </div>
              )}
            </div>
          </div>
          <div className='flex gap-4'>
            <CircleButton
              icon={<Plus className='size-6' />}
              label='Deposit'
              onClick={onTopUp}
            />
            <CircleButton
              icon={<Send01 className='size-6' />}
              label='Send'
              onClick={() => setOpen(true)}
            />
            <WalletSendDialog
              open={open}
              setOpen={setOpen}
              sendUSDC={sendUSDC}
              usdcBalance={usdcBalance}
            />
          </div>
        </div>
        <div className='mb-2 ml-6 mt-2'>
          <SelectDuration
            selectedValue={selectedDuration}
            onChange={(value) => onTxnDurationChange(value)}
          />
        </div>
        <BalanceChart balanceHistory={cumulativeBalanceHistory} />
      </div>
    </div>
  );
};

const CircleButton: React.FC<{
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <div className='flex h-auto w-auto flex-col items-center gap-1 p-0'>
      <Button
        className='bg-sorbet flex size-12 items-center justify-center rounded-full p-0 text-white'
        onClick={onClick}
      >
        {icon}
      </Button>
      {label && <span className='text-sm text-[#595B5A]'>{label}</span>}
    </div>
  );
};
