import { Wallet } from 'lucide-react';
import Image from 'next/image';

import { RecipientAPI } from '@/api/recipients/types';
import { Timing } from '@/app/(with-sidebar)/recipients/components/send/timing';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Separator } from '@/components/ui/separator';
import { useMyChain } from '@/hooks/use-my-chain';
import { useWalletAddress } from '@/hooks/use-wallet-address';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { ExchangeRate } from './exchange-rate';

/** Renders a preview of a transaction, showing:
 *  - amount
 *  - timing
 *  - optional conversion rate (only for EUR recipients)
 *  - from and to
 */
export const PreviewSend = ({
  amount,
  recipient,
}: {
  amount: number;
  recipient: RecipientAPI;
}) => {
  const { data: myChainData } = useMyChain();
  const currentChain = myChainData?.chain ?? 'base';
  const { smartWalletAddress } = useSmartWalletAddress();
  const { stellarAddress } = useWalletAddress();
  const showConversion = recipient.type === 'eur';
  const paymentChain: 'base' | 'stellar' =
    recipient.type === 'crypto_stellar'
      ? 'stellar'
      : recipient.type === 'crypto_base'
      ? 'base'
      : currentChain;

  const fromAddress =
    paymentChain === 'stellar'
      ? stellarAddress ?? ''
      : smartWalletAddress ?? '';

  return (
    <div className='animate-in fade-in-0 slide-in-from-right-2 space-y-10'>
      {/* Amount, timing, and optional conversion rate */}
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm font-medium leading-none'>
          Amount
        </p>
        <p className='text-xl font-semibold'>{formatCurrency(amount)}</p>
        <Timing type={recipient.type} />
        {showConversion && <ExchangeRate amount={amount} />}
      </div>

      {/* From and to */}
      <div>
        <div>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <Wallet className='text-foreground size-4' /> From
          </p>
          <CopyAddress address={fromAddress}>
            <span className='inline-flex items-center gap-2'>
              <Image
                src={
                  paymentChain === 'stellar'
                    ? '/svg/stellar_logo.svg'
                    : '/svg/base_logo.svg'
                }
                alt={paymentChain === 'stellar' ? 'Stellar' : 'Base'}
                width={14}
                height={14}
              />
              My Sorbet Wallet (
              {paymentChain === 'stellar' ? 'Stellar' : 'Base'})
            </span>
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
