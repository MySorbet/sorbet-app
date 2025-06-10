import { ArrowLeftRight, Wallet } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { Timing } from '@/app/(with-sidebar)/recipients/components/send/timing';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Separator } from '@/components/ui/separator';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

/** Renders a preview of a transaction, showing:
 *  - amount
 *  - timing
 *  - optional conversion rate
 *  - from and to
 */
export const PreviewSend = ({
  amount,
  recipient,
}: {
  amount: number;
  recipient: RecipientAPI;
}) => {
  const { smartWalletAddress } = useSmartWalletAddress();

  // TODO: show conversion and rate would be based on recipient type
  const showConversion = false;

  return (
    <div className='animate-in fade-in-0 slide-in-from-right-2 space-y-10'>
      {/* Amount, timing, and optional conversion rate */}
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm font-medium leading-none'>
          Amount
        </p>
        <p className='text-xl font-semibold'>{formatCurrency(amount)}</p>
        <Timing type={recipient.type} />
        {showConversion && (
          <p className='text-muted-foreground flex items-center gap-1 text-sm leading-none'>
            <ArrowLeftRight className='size-3' /> Conversion rate XXXXXXX
          </p>
        )}
      </div>

      {/* From and to */}
      <div>
        <div>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <Wallet className='text-foreground size-4' /> From
          </p>
          <CopyAddress address={smartWalletAddress ?? ''}>
            My Sorbet Wallet
          </CopyAddress>
        </div>
        <Separator orientation='vertical' className='mx-2 -mt-5 mb-2 h-8' />
        <div>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <Wallet className='text-foreground size-4' /> To
          </p>
          <CopyAddress address={recipient?.walletAddress ?? ''}>
            {formatWalletAddress(recipient?.walletAddress ?? '')}
          </CopyAddress>
        </div>
      </div>
    </div>
  );
};

/** Common CopyButton customized for copyable addresses in from/to */
const CopyAddress = ({
  address,
  children,
}: {
  address: string;
  children: React.ReactNode;
}) => {
  return (
    <CopyButton
      className='ml-5 h-fit flex-row-reverse p-1 text-sm font-normal'
      stringToCopy={address}
      variant='link'
      copyIconClassName='text-muted-foreground'
    >
      {children}
    </CopyButton>
  );
};
