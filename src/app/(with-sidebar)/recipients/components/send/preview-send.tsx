import { Wallet } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { useSendToFormContext } from '@/app/(with-sidebar)/recipients/components/send/send-to-context';
import { Timing } from '@/app/(with-sidebar)/recipients/components/send/timing';
import { usesTransfersApi } from '@/app/(with-sidebar)/recipients/components/utils';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Separator } from '@/components/ui/separator';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { formatAccountNumber } from '../utils';
import { ExchangeRate } from './exchange-rate';

/** Converts a purpose code like SALARY_PAYMENT to "Salary Payment" */
const formatPurposeCode = (code: string): string =>
  code
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

/** Renders a preview of a transaction, showing:
 *  - amount
 *  - timing
 *  - optional conversion rate (only for EUR recipients)
 *  - from and to
 *  - purpose of transfer (for ACH/WIRE)
 */
export const PreviewSend = ({
  amount,
  recipient,
}: {
  amount: number;
  recipient: RecipientAPI;
}) => {
  const { smartWalletAddress } = useSmartWalletAddress();
  const form = useSendToFormContext();
  const purposeCode = form.getValues('purposeCode');
  const showConversion = recipient.type === 'eur';
  const showPurpose = usesTransfersApi(recipient) && !!purposeCode;

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
          <CopyAddress address={smartWalletAddress ?? ''}>
            My Sorbet Wallet
          </CopyAddress>
        </div>
        <Separator orientation='vertical' className='mx-2 -mt-5 mb-2 h-8' />
        <div>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <Wallet className='text-foreground size-4' /> To
          </p>
          {recipient.type === 'crypto' ? (
            <CopyAddress address={recipient?.walletAddress ?? ''}>
              {formatWalletAddress(recipient?.walletAddress ?? '')}
            </CopyAddress>
          ) : (
            <p className='ml-5 text-sm'>
              {recipient.label} · {formatAccountNumber(recipient.detail)}
            </p>
          )}
        </div>
      </div>

      {/* Purpose of transfer — shown for ACH/WIRE */}
      {showPurpose && (
        <div className='space-y-1'>
          <p className='text-muted-foreground text-sm font-medium'>
            Purpose of Transfer
          </p>
          <p className='text-sm font-semibold'>{formatPurposeCode(purposeCode)}</p>
        </div>
      )}
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
