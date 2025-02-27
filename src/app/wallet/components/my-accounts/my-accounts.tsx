import { BadgeDollarSign } from 'lucide-react';
import Link from 'next/link';

import {
  ACHWireDetails,
  useACHWireDetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
import { PaymentMethod } from '@/components/common/payment-methods/payment-method';
import { PaymentMethodDescription } from '@/components/common/payment-methods/payment-method-description';
import { VirtualAccountDetails } from '@/components/common/payment-methods/virtual-account-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsVerified } from '@/hooks/profile/use-is-verified';
import { useAuth } from '@/hooks/use-auth';
import AmericanFlagIcon from '~/svg/american-flag-icon.svg';

/** Render details for the users accounts */
export const MyAccounts = () => {
  // TODO: All this fetching is a little redundant. Think about this
  const { user } = useAuth();
  const isVerified = useIsVerified();
  const { data: account, isLoading } = useACHWireDetails(user?.id ?? '', {
    enabled: isVerified,
  });

  return (
    <Card className='h-fit'>
      <CardHeader className='bg-primary-foreground rounded-t-md px-4 py-6 '>
        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
          <AmericanFlagIcon className='size-8' />
          Digital Dollars
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        {/* USDC Account */}
        <PaymentMethodUSD account={account} isVerified={isVerified} />
      </CardContent>
    </Card>
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
      tooltip='Send USD to this bank account to pay this invoice'
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
