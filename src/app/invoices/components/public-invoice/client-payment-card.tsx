import { AnimatePresence, motion } from 'framer-motion';
import { BadgeDollarSign } from 'lucide-react';
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

import { ACHWireDetails } from '../../hooks/use-ach-wire-details';
import { useBaseQRCode } from '../../hooks/use-base-qr-code';
import { AcceptedPaymentMethod } from '../../schema';
import { formatDate } from '../../utils';

/**
 *  Renders payment details for the client to pay the invoice
 *  If `dueDate` is omitted, the payment card will be a loading state
 *
 *  Pass a wallet address to render the USDC payment method
 *  Pass a bank account to render the USD payment method
 */
export const ClientPaymentCard = ({
  address,
  account,
  dueDate,
  isLoading,
}: {
  address?: string;
  account?: ACHWireDetails;
  dueDate?: Date;
  isLoading?: boolean;
}) => {
  const [selectedTab, setSelectedTab] = useState<
    AcceptedPaymentMethod | undefined
  >('usdc');
  const handleTabChange = (value: string) => {
    setSelectedTab(value as AcceptedPaymentMethod);
  };

  const title = dueDate
    ? `Payment due by ${formatDate(dueDate)}`
    : 'Payment due';
  const description =
    selectedTab === 'usdc'
      ? 'Send USDC on Base network'
      : 'Transfer via ACH/Wire';

  const hideUSDCTab = Boolean(!isLoading && !address && account);
  const hideUSDTab = Boolean(!isLoading && address && !account);

  // If one of the payment methods is hidden,
  // set the selected tab to the other payment method
  useEffect(() => {
    hideUSDCTab && setSelectedTab('usd');
    hideUSDTab && setSelectedTab('usdc');
  }, [hideUSDCTab, hideUSDTab]);

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
              className='w-1/2'
              value='usdc'
              disabled={isLoading || hideUSDTab}
            >
              Pay USDC
            </TabsTrigger>
          )}
          {!hideUSDTab && (
            <TabsTrigger
              className='w-1/2'
              value='usd'
              disabled={isLoading || hideUSDCTab}
            >
              Pay via ACH/Wire
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
            value='usd'
            className='animate-in fade-in-0 slide-in-from-top-1'
          >
            {!isLoading && account && <PaymentMethodUSD account={account} />}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

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
      timing='Arrives instantly'
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
      timing='Arrives in 1-2 days'
      tooltip='Send USD to this bank account to pay this invoice'
    >
      <VirtualAccountDetails account={account} />
    </PaymentMethod>
  );
};
