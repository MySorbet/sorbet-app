import { AnimatePresence, motion } from 'framer-motion';
import { BadgeDollarSign, BadgeEuro } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BaseAlert } from '@/components/common/base-alert';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { PaymentMethod } from '@/components/common/payment-methods/payment-method';
import { VirtualAccountDetails } from '@/components/common/payment-methods/virtual-account-details';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatWalletAddress } from '@/lib/utils';
import USDCBaseIcon from '~/svg/base-usdc.svg';

import { ACHWireDetails, SEPADetails } from '../../hooks/use-ach-wire-details';
import { useBaseQRCode } from '../../hooks/use-base-qr-code';
import { formatDate, PAYMENT_TIMING_DESCRIPTIONS } from '../../utils';

/**
 *  Renders payment details for the client to pay the invoice
 *
 *  Pass a wallet address to render the USDC payment method
 *  Pass a bank account to render the USD payment method
 *  Pass a eur bank account to render the SEPA payment method
 */
export const ClientPaymentCard = ({
  address,
  account,
  eurAccount,
  dueDate,
  isLoading,
}: {
  address?: string;
  account?: ACHWireDetails;
  eurAccount?: SEPADetails;
  dueDate?: Date;
  isLoading?: boolean;
}) => {
  const [selectedTab, setSelectedTab] = useState<TabType>('usdc');
  const handleTabChange = (value: string) => {
    setSelectedTab(value as TabType);
  };

  const title = dueDate
    ? `Payment due by ${formatDate(dueDate)}`
    : 'Payment due';
  const description = buildDescription(selectedTab, !!account, !!eurAccount);

  const hideUSDCTab = Boolean(!isLoading && !address && account);
  const hideFiatTab = Boolean(!isLoading && address && !account);

  // If one of the payment methods is hidden,
  // set the selected tab to the other payment method
  useEffect(() => {
    hideUSDCTab && setSelectedTab('fiat');
    hideFiatTab && setSelectedTab('usdc');
  }, [hideUSDCTab, hideFiatTab]);

  return (
    <Card className='max-w-lg'>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        <TabsList className='w-full justify-around rounded-b-none'>
          {!hideUSDCTab && (
            <TabsTrigger
              className='flex-1'
              value='usdc'
              disabled={isLoading || hideFiatTab}
            >
              Pay USDC
            </TabsTrigger>
          )}
          {!hideFiatTab && (
            <TabsTrigger
              className='flex-1'
              value='fiat'
              disabled={isLoading || hideUSDCTab}
            >
              Pay Fiat
            </TabsTrigger>
          )}
        </TabsList>
        <CardHeader className='bg-primary-foreground space-y-0 px-4 py-6'>
          {isLoading ? (
            <div className='space-y-2'>
              <Skeleton variant='darker' className='h-5 w-40' />
              <Skeleton variant='darker' className='h-4 w-60' />
            </div>
          ) : (
            <>
              <CardTitle className='text-base font-semibold'>{title}</CardTitle>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={description}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.075 }} // Half the duration of the slide-in animation doubled with wait mode
                >
                  <CardDescription>{description}</CardDescription>
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </CardHeader>
        <CardContent className='p-3'>
          {isLoading && <PaymentMethodSkeleton />}
          <TabsContent
            value='usdc'
            className='animate-in fade-in-0 slide-in-from-top-1'
          >
            {!isLoading && address && <PaymentMethodUSDC address={address} />}
          </TabsContent>
          <TabsContent
            value='fiat'
            className='animate-in fade-in-0 slide-in-from-top-1'
          >
            {!isLoading && account && <PaymentMethodUSD account={account} />}
            {!isLoading && eurAccount && (
              <PaymentMethodEUR account={eurAccount} />
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

/** Mimic the shape of payment method to minimize layout shift */
const PaymentMethodSkeleton = () => {
  return (
    <PaymentMethod title={<Skeleton className='h-5 w-40' />} Icon={Skeleton}>
      <Skeleton className='h-60 w-full' />
      <Skeleton className='h-20 w-full' />
    </PaymentMethod>
  );
};

/** Local component specializing the PaymentMethod component for USDC */
const PaymentMethodUSDC = ({ address }: { address: string }) => {
  const formattedAddress = formatWalletAddress(address);
  const { qrCodeRef, isLoadingQRCode } = useBaseQRCode(address);
  return (
    <PaymentMethod
      title='USDC wallet'
      Icon={USDCBaseIcon}
      timing={PAYMENT_TIMING_DESCRIPTIONS.crypto}
    >
      <div className='flex items-center justify-between'>
        <span className='text-muted-foreground text-sm'>Wallet</span>
        <div className='flex items-center gap-1 text-sm'>
          {formattedAddress}
          <CopyIconButton stringToCopy={address} className='ml-1' />
        </div>
      </div>
      <Card className='flex items-center justify-center p-3'>
        {isLoadingQRCode ? (
          <Skeleton className='size-48' />
        ) : (
          <div ref={qrCodeRef} />
        )}
      </Card>
      <BaseAlert
        description='This address can only receive USDC on the Base Network. Funds may be lost if USDC is sent on another network.'
        className='text-muted-foreground'
      />
    </PaymentMethod>
  );
};

/** Local component specializing the PaymentMethod component for USD */
const PaymentMethodUSD = ({ account }: { account: ACHWireDetails }) => {
  return (
    <PaymentMethod
      title='USD Bank'
      Icon={BadgeDollarSign}
      timing={PAYMENT_TIMING_DESCRIPTIONS.bank}
      tooltip='Send USD to this bank account to pay this invoice'
    >
      <VirtualAccountDetails.USD account={account} />
    </PaymentMethod>
  );
};

/** Local component specializing the PaymentMethod component for USD */
const PaymentMethodEUR = ({ account }: { account: SEPADetails }) => {
  return (
    <PaymentMethod
      title='EUR Bank'
      Icon={BadgeEuro}
      timing={PAYMENT_TIMING_DESCRIPTIONS.bank}
      tooltip='Send EUR to this bank account to pay this invoice'
    >
      <VirtualAccountDetails.EUR account={account} />
    </PaymentMethod>
  );
};

/** What tabs may be selected */
type TabType = 'usdc' | 'fiat';

/** Build a description for the payment card based on the selected and available payment methods */
const buildDescription = (
  tab: TabType,
  hasUsdAccount: boolean,
  hasEurAccount: boolean
) => {
  if (tab === 'usdc') return 'Send USDC on Base network';
  let description = 'Transfer via ';
  if (hasUsdAccount && hasEurAccount) {
    description += 'ACH/Wire or SEPA';
  } else if (hasUsdAccount) {
    description += 'ACH/Wire';
  } else if (hasEurAccount) {
    description += 'SEPA';
  }
  return description;
};
