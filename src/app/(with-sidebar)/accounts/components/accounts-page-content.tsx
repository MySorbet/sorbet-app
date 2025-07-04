'use client';

import { useState } from 'react';

import { AutomaticVerificationTabs } from '@/app/(with-sidebar)/accounts/components/verification/automatic-verification-tabs';
import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import {
  mapToEURWireDetails,
  useACHWireDetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';

import { useClaimVirtualAccount } from '../hooks/use-claim-virtual-account';
import { AccountSelect } from './account-select';
import { VAAccountDetails } from './va-details';

/**
 * Compose account components into a page with state
 */
export const AccountsPageContent = () => {
  const { user } = useAuth();
  const { isBaseApproved, isPending } = useEndorsements();
  const { data: customer } = useBridgeCustomer();
  const { data: account } = useACHWireDetails(user?.id ?? '', {
    enabled: !isPending && !!user?.id && isBaseApproved,
  });
  const [selectedAccount, setSelectedAccount] = useState<'usd' | 'eur'>('usd');

  const enabledAccounts = [
    customer?.virtual_account && 'usd',
    customer?.virtual_account_eur && 'eur',
  ].filter(Boolean) as ('usd' | 'eur')[];

  const eurAccount = customer?.virtual_account_eur
    ? mapToEURWireDetails(
        customer.virtual_account_eur.source_deposit_instructions
      )
    : undefined;

  const isMobile = useIsMobile();

  return (
    <div className='flex size-full max-w-7xl flex-col gap-6 lg:flex-row'>
      <AccountSelect
        className='w-full lg:max-w-sm'
        selected={selectedAccount}
        onSelect={setSelectedAccount}
        enabledAccounts={enabledAccounts}
      />

      {selectedAccount === 'usd' ? (
        customer?.hasClaimedVirtualAccount ? (
          account ? (
            <AccountDetailsCard>
              <VAAccountDetails.USD account={account} />
            </AccountDetailsCard>
          ) : isMobile ? (
            <Drawer dismissible={false} open={true}>
              <DrawerContent className='h-[95%]'>
                <AutomaticVerificationTabs className='pt-2' />
              </DrawerContent>
            </Drawer>
          ) : (
            <AutomaticVerificationTabs />
          )
        ) : (
          <ClaimAccountButton type='usd' />
        )
      ) : customer?.hasClaimedVirtualAccountEur ? (
        eurAccount ? (
          <AccountDetailsCard>
            <VAAccountDetails.EUR account={eurAccount} />
          </AccountDetailsCard>
        ) : isMobile ? (
          <Drawer open={true} dismissible={false}>
            <DrawerContent className='h-[95%]'>
              <AutomaticVerificationTabs className='pt-2' />
            </DrawerContent>
          </Drawer>
        ) : (
          <AutomaticVerificationTabs />
        )
      ) : (
        <ClaimAccountButton type='eur' />
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

const ClaimAccountButton = ({ type }: { type: 'usd' | 'eur' }) => {
  const { mutate: claimVirtualAccount, isPending: isClaiming } =
    useClaimVirtualAccount(type);

  return (
    <Card className='flex size-full flex-col items-center justify-center gap-4 p-6'>
      <p className='text-muted-foreground text-sm'>
        {type === 'usd'
          ? 'Claim your USD account to start accepting payments.'
          : 'Claim your EUR account to start accepting payments.'}
      </p>
      <Button
        variant='sorbet'
        onClick={() => claimVirtualAccount()}
        disabled={isClaiming}
      >
        {isClaiming && <Spinner />}
        {isClaiming
          ? 'Claiming...'
          : `Claim ${type.toLocaleUpperCase()} Account`}
      </Button>
    </Card>
  );
};
