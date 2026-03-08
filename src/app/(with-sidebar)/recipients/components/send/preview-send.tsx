import { Wallet } from 'lucide-react';
import Image from 'next/image';

import { RecipientAPI } from '@/api/recipients/types';
import { useSendToContext, useSendToFormContext } from '@/app/(with-sidebar)/recipients/components/send/send-to-context';
import { Timing } from '@/app/(with-sidebar)/recipients/components/send/timing';
import { formatAccountNumber, isBankRecipient, usesTransfersApi, formatPurposeCode } from '@/app/(with-sidebar)/recipients/components/utils';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Separator } from '@/components/ui/separator';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletAddress } from '@/hooks/use-wallet-address';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

/** Renders a preview of a transaction, showing:
 *  - amount
 *  - timing
 *  - fee breakdown with optional FX conversion (for non-USD recipients)
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
  const { paymentChain, feeBreakdown, recipientFeeStructure, isFeeEstimatePending, isFeeEstimateUnavailable } = useSendToContext();
  const { smartWalletAddress } = useSmartWalletAddress();
  const { stellarAddress } = useWalletAddress();
  const form = useSendToFormContext();
  const purposeCode = form.getValues('purposeCode');
  const showPurpose = usesTransfersApi(recipient) && !!purposeCode;

  const fromAddress =
    paymentChain === 'stellar'
      ? stellarAddress ?? ''
      : smartWalletAddress ?? '';

  return (
    <div className='animate-in fade-in-0 slide-in-from-right-2 space-y-10'>
      {/* Amount and timing */}
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm font-medium leading-none'>
          Amount
        </p>
        <p className='text-xl font-semibold'>{formatCurrency(amount)}</p>
        <Timing type={recipient.type} speed={recipientFeeStructure?.speed} />
      </div>

      {/* Fee breakdown — running-total equation (for bank recipients only) */}
      {isBankRecipient(recipient) && isFeeEstimatePending && (
        <p className='text-muted-foreground text-sm'>Fetching exchange rate...</p>
      )}
      {isBankRecipient(recipient) && isFeeEstimateUnavailable && (
        <p className='text-muted-foreground text-sm'>Exchange rate temporarily unavailable.</p>
      )}
      {isBankRecipient(recipient) && feeBreakdown && feeBreakdown.totalFee < feeBreakdown.sendAmount && (
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm font-medium'>
            ≈ Approximate Breakdown
          </p>
          <div className='flex justify-between text-sm'>
            <span>You send</span>
            <span>{feeBreakdown.sendAmount.toFixed(2)} USDC</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span>Fee</span>
            <span>−{feeBreakdown.totalFee.toFixed(2)} USDC</span>
          </div>
          <Separator />
          <div className='flex justify-between text-sm'>
            <span>After fees</span>
            <span>{feeBreakdown.amountAfterFee.toFixed(2)} USDC</span>
          </div>
          {feeBreakdown.fxRate && (
            <>
              <div className='flex justify-between text-sm'>
                <span>Exchange rate</span>
                <span>
                  × {feeBreakdown.fxRate.toFixed(4)} {feeBreakdown.destinationCurrency}/USDC
                </span>
              </div>
              <Separator />
            </>
          )}
          <div className='flex justify-between text-sm font-medium'>
            <span>Recipient receives</span>
            <span>
              ≈ {feeBreakdown.receiveAmount.toFixed(2)}{' '}
              {feeBreakdown.destinationCurrency}
            </span>
          </div>
        </div>
      )}

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
          {recipient.type === 'crypto_base' || recipient.type === 'crypto_stellar' ? (
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
