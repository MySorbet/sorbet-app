'use client';

import { DollarSign, Euro } from 'lucide-react';
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
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer';
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

  // Open state of both the verification drawer or the account details drawer (only for mobile)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleSelectAccount = (id: 'usd' | 'eur') => {
    setSelectedAccount(id);
    setIsDrawerOpen(true); // A click (even if already selected) should open the drawer
  };

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
        onSelect={handleSelectAccount}
        enabledAccounts={enabledAccounts}
      />

      {selectedAccount === 'usd' ? (
        customer?.hasClaimedVirtualAccount ? (
          account ? (
            <AccountDetailsCard open={isDrawerOpen} setOpen={setIsDrawerOpen}>
              <VAAccountDetails.USD account={account} />
            </AccountDetailsCard>
          ) : isMobile ? (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
          <AccountDetailsCard open={isDrawerOpen} setOpen={setIsDrawerOpen}>
            <VAAccountDetails.EUR account={eurAccount} />
          </AccountDetailsCard>
        ) : isMobile ? (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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

/**
 * Local component to encapsulate the account details card style and the fact that it is a drawer on mobile
 */
const AccountDetailsCard = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='flex flex-col gap-4 p-6'>
          {children}
          <DrawerClose>
            <Button variant='secondary' className='w-full'>
              Close
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }

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
      {type === 'usd' ? (
        <DollarSign className='text-muted-foreground size-10' />
      ) : (
        <Euro className='text-muted-foreground size-10' />
      )}
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
