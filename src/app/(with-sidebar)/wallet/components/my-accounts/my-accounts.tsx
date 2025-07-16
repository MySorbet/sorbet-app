'use client';

import { BadgeDollarSign, BadgeEuro } from 'lucide-react';
import Link from 'next/link';

import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import { useACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { useSEPADetails } from '@/app/invoices/hooks/use-sepa-details';
import { PAYMENT_TIMING_DESCRIPTIONS } from '@/app/invoices/utils';
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
  const { smartWalletAddress } = useSmartWalletAddress();

  return (
    <Card className='h-fit'>
      <CardHeader className='bg-primary-foreground rounded-t-md px-4 py-6 '>
        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
          <AmericanFlagIcon className='size-8' />
          Digital Dollars
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        <PaymentMethodUSDC walletAddress={smartWalletAddress ?? undefined} />
        <PaymentMethodUSD />
        <PaymentMethodEUR />
      </CardContent>
    </Card>
  );
};

/**
 * Local component specializing the PaymentMethod component for USDC
 * - Very similar to the payment method rendered in `ClientPaymentCard` (share?)
 */
const PaymentMethodUSDC = ({ walletAddress }: { walletAddress?: string }) => {
  const formattedAddress = walletAddress && formatWalletAddress(walletAddress);
  return (
    <PaymentMethod
      title='USDC Wallet'
      Icon={USDCBaseIcon}
      timing={PAYMENT_TIMING_DESCRIPTIONS.crypto}
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
 * - Pretty much identical to the payment method composed in `ClientPaymentCard` (share?)
 */
const PaymentMethodUSD = () => {
  // TODO: All this fetching is a little redundant. Think about this
  // Also note that I am experimenting with pushing data fetching to the bottom of the component tree here
  const { user } = useAuth();
  const isVerified = useIsVerified();
  const { data: account, isLoading } = useACHWireDetails(user?.id ?? '', {
    enabled: isVerified,
  });

  // TODO: We don't have a great loading state while checking verification because useIsVerified just returns false until the call completes

  return (
    <PaymentMethod
      title='USD Virtual account'
      Icon={BadgeDollarSign}
      timing={isVerified ? PAYMENT_TIMING_DESCRIPTIONS.bank : undefined}
      tooltip='Your free USD account to receive ACH/Wire payments'
    >
      {isVerified ? (
        account && !isLoading ? (
          <VirtualAccountDetails.USD account={account} />
        ) : (
          <Skeleton className='h-32 w-full' />
        )
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

/**
 * Local component specializing the PaymentMethod component for EUR
 * - Pretty much identical to the payment method composed in `ClientPaymentCard` (share?)
 */
const PaymentMethodEUR = () => {
  // TODO: All this fetching is a little redundant. Think about this
  // Also note that I am experimenting with pushing data fetching to the bottom of the component tree here
  const { user } = useAuth();
  const { isEurApproved, isPending } = useEndorsements();
  const { data: account, isLoading } = useSEPADetails(user?.id ?? '', {
    enabled: isEurApproved,
  });

  const loading = isPending || isLoading;

  return (
    <PaymentMethod
      title='EUR Virtual account'
      Icon={BadgeEuro}
      timing={isEurApproved ? PAYMENT_TIMING_DESCRIPTIONS.bank : undefined}
      tooltip='Your free EUR account to receive SEPA payments'
    >
      {isEurApproved ? (
        account && !loading ? (
          <VirtualAccountDetails.EUR account={account} />
        ) : (
          <Skeleton className='h-32 w-full' />
        )
      ) : (
        <>
          <PaymentMethodDescription>
            KYC verification required to accept SEPA payments
          </PaymentMethodDescription>
          <Button variant='outline' className='w-full' asChild>
            <Link href='/verify'>Get verified in minutes</Link>
          </Button>
        </>
      )}
    </PaymentMethod>
  );
};
