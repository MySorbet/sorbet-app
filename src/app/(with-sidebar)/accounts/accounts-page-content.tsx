'use client';

import { useState } from 'react';

import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import { UploadProofOfAddress } from '@/app/(with-sidebar)/verify/components/upload-proof-of-address';
import { useACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { VirtualAccountDetails } from '@/components/common/payment-methods/virtual-account-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useAuth } from '@/hooks/use-auth';

import { AccountSelect } from './account-select';
import { useClaimEur } from './hooks/use-claim-eur';

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

  const enabledAccounts = (customer?.virtual_account ? ['usd'] : []) satisfies (
    | 'usd'
    | 'eur'
  )[];

  const { mutate: claimEur, isPending: isClaimingEur } = useClaimEur();

  const eurAccount = customer?.virtual_account_eur;

  return (
    <div className='flex size-full max-w-7xl flex-col gap-6 lg:flex-row'>
      <AccountSelect
        className='w-full lg:max-w-sm'
        selected={selectedAccount}
        onSelect={setSelectedAccount}
        enabledAccounts={enabledAccounts}
      />
      <Card className='h-fit w-full'>
        <CardContent className='flex flex-col items-center justify-center p-6'>
          {selectedAccount === 'usd' ? (
            isBaseApproved ? (
              account ? (
                <VirtualAccountDetails account={account} />
              ) : (
                // TODO: Backend action to generate USD account
                <Button variant='sorbet'>Claim USD account</Button>
              )
            ) : (
              <Button variant='sorbet'>Start verification</Button>
            )
          ) : isEurApproved ? (
            eurAccount ? (
              <div>{JSON.stringify(eurAccount)}</div>
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
            <UploadProofOfAddress />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
