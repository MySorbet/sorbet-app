import { BadgeDollarSign } from 'lucide-react';
import Link from 'next/link';

import {
  ACHWireDetails,
  useACHWireDetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { PaymentMethod } from '@/components/common/payment-methods/payment-method';
import { PaymentMethodDescription } from '@/components/common/payment-methods/payment-method-description';
import { VirtualAccountDetails } from '@/components/common/payment-methods/virtual-account-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
import { useAuth } from '@/hooks/use-auth';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { formatWalletAddress } from '@/lib/utils';
import AmericanFlagIcon from '~/svg/american-flag-icon.svg';
import USDCBaseIcon from '~/svg/base-usdc.svg';

/** Render details for the users accounts */
export const MyAccounts = () => {
  // TODO: All this fetching is a little redundant. Think about this
  const { user } = useAuth();
  const isVerified = useIsVerified();
  const { data: account, isLoading } = useACHWireDetails(user?.id ?? '', {
    enabled: isVerified,
  });
  const { smartWalletAddress } = useSmartWalletAddress();

  // TODO: Loading states for virtual account
  return (
    <Card className='h-fit'>
      <CardHeader className='bg-primary-foreground rounded-t-md px-4 py-6 '>
        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
          <AmericanFlagIcon className='size-8' />
          Digital Dollars
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        <PaymentMethodUSDC walletAddress={smartWalletAddress} />
        <PaymentMethodUSD account={account} isVerified={isVerified} />
      </CardContent>
    </Card>
  );
};

/**
 * Local component specializing the PaymentMethod component for USDC
 * - Very similar to the payment method rendered in `ClientPaymentCard` (share?)
 */
const PaymentMethodUSDC = ({ walletAddress }: { walletAddress: string }) => {
  const formattedAddress = walletAddress && formatWalletAddress(walletAddress);
  return (
    <PaymentMethod
      title='USDC Wallet'
      Icon={USDCBaseIcon}
      timing='Arrives instantly'
      tooltip='Your crypto wallet to receive instant USDC payments on the Base network'
    >
      <div className='flex items-center justify-between'>
        <span className='text-muted-foreground text-sm'>My Wallet</span>
        <div className='flex items-center gap-1 text-sm'>
          {formattedAddress ?? <Skeleton className='h-5 w-24' />}
          <CopyIconButton
            stringToCopy={walletAddress}
            className='ml-1'
            disabled={!walletAddress}
            aria-label='Copy wallet address'
          />
        </div>
      </div>
    </PaymentMethod>
  );
};

/**
 * Local component specializing the PaymentMethod component for USD
 * - Pretty much identical to the payment method rendered in `ClientPaymentCard` (share?)
 */
const PaymentMethodUSD = ({
  account,
  isVerified,
}: {
  account?: ACHWireDetails;
  isVerified?: boolean;
}) => {
  return (
    <PaymentMethod
      title='USD Virtual account'
      Icon={BadgeDollarSign}
      timing={isVerified ? 'Arrives in 1-2 days' : undefined}
      tooltip='Your free USD account to receive ACH/Wire payments'
    >
      {isVerified ? (
        account && <VirtualAccountDetails account={account} />
      ) : (
        <>
          <PaymentMethodDescription>
            KYC verification required to accept ACH/Wire payments
          </PaymentMethodDescription>
          <Button variant='outline' className='w-full' asChild>
            <Link href='/verify'>Get verified in minutes</Link>
          </Button>
        </>
      )}
    </PaymentMethod>
  );
};
