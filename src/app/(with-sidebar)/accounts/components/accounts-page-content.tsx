'use client';

import { useState } from 'react';

import { VerificationTabsFromCustomer } from '@/app/(with-sidebar)/accounts/components/verification/verification-tabs-from-customer';
import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import {
  mapToEURWireDetails,
  useACHWireDetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useAuth } from '@/hooks/use-auth';

import { useClaimEur } from '../hooks/use-claim-eur';
import { AccountSelect } from './account-select';
import { VAAccountDetails } from './va-details';

/**
 * Compose account components into a page with state
 */
export const AccountsPageContent = () => {
  const { user } = useAuth();
  const { isBaseApproved, isEurApproved, isPending } = useEndorsements();
  const { data: customer } = useBridgeCustomer();
  const { data: account } = useACHWireDetails(user?.id ?? '', {
    enabled: !isPending && !!user?.id && isBaseApproved,
  });
  const [selectedAccount, setSelectedAccount] = useState<'usd' | 'eur'>('usd');

  const enabledAccounts = [
    customer?.virtual_account && 'usd',
    customer?.virtual_account_eur && 'eur',
  ].filter(Boolean) as ('usd' | 'eur')[];

  const { mutate: claimEur, isPending: isClaimingEur } = useClaimEur();

  const eurAccount = customer?.virtual_account_eur
    ? mapToEURWireDetails(
        customer.virtual_account_eur.source_deposit_instructions
      )
    : undefined;

  return (
    <div className='flex size-full max-w-7xl flex-col gap-6 lg:flex-row'>
      <AccountSelect
        className='w-full lg:max-w-sm'
        selected={selectedAccount}
        onSelect={setSelectedAccount}
        enabledAccounts={enabledAccounts}
      />

      {selectedAccount === 'usd' ? (
        isBaseApproved ? (
          account ? (
            <AccountDetailsCard>
              <VAAccountDetails.USD account={account} />
            </AccountDetailsCard>
          ) : (
            // TODO: Backend action to generate USD account
            <Button variant='sorbet' disabled>
              Claim USD account
            </Button>
          )
        ) : (
          <VerificationTabsFromCustomer />
        )
      ) : isEurApproved ? (
        eurAccount ? (
          <AccountDetailsCard>
            <VAAccountDetails.EUR account={eurAccount} />
          </AccountDetailsCard>
        ) : (
          <div className='flex flex-col items-center justify-center gap-4'>
            <p className='text-muted-foreground text-sm'>
              You are approved to accept EUR payments.
            </p>
            <Button
              variant='sorbet'
              onClick={() => claimEur()}
              disabled={isClaimingEur}
            >
              {isClaimingEur ? 'Claiming...' : 'Claim EUR Account'}
            </Button>
          </div>
        )
      ) : (
        <VerificationTabsFromCustomer />
      )}
    </div>
  );
};

const AccountDetailsCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className='h-fit w-full'>
      <CardContent className='flex flex-col items-center justify-center p-6'>
        {children}
      </CardContent>
    </Card>
  );
};
