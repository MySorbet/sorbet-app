import { AnimatePresence, motion } from 'framer-motion';
import { BadgeDollarSign, Landmark } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BaseAlert } from '@/components/common/base-alert';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { PaymentMethod } from '@/components/common/payment-methods/payment-method';
import { RailDisplay } from '@/components/common/payment-methods/virtual-account-details';
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

import { useBaseQRCode } from '../../hooks/use-base-qr-code';
import { type DueBankDetailsForRail } from '../../hooks/use-due-bank-details';
import { AcceptedPaymentMethod } from '../../schema';
import { formatDate, PAYMENT_TIMING_DESCRIPTIONS } from '../../utils';

/** What tabs may be selected */
type TabType = 'usdc' | 'bank';

/**
 * Renders payment details for the client to pay the invoice.
 *
 * - Pass `address` to render the USDC tab.
 * - Pass `bankDetails` (rail + raw Due data) to render the Bank tab with
 *   the exact fields for the chosen rail — no generic fallback fields shown.
 * - Pass `paymentMethods` to control which tabs are visible.
 */
export const ClientPaymentCard = ({
  address,
  bankDetails,
  dueDate,
  isLoading,
  paymentMethods,
}: {
  /** Wallet address for USDC payment */
  address?: string;
  /** Rail + raw Due bank data for the exact rail selected on this invoice */
  bankDetails?: DueBankDetailsForRail;
  dueDate?: Date;
  isLoading?: boolean;
  paymentMethods?: AcceptedPaymentMethod[];
}) => {
  const [selectedTab, setSelectedTab] = useState<TabType>('usdc');

  const hasUsdc = paymentMethods?.includes('usdc') ?? true;
  const hasBank =
    (paymentMethods?.includes('usd') ||
      paymentMethods?.includes('eur') ||
      paymentMethods?.includes('aed')) ??
    false;

  const hideUSDCTab = !isLoading && !hasUsdc;
  const hideBankTab = !isLoading && !hasBank;

  useEffect(() => {
    if (hideUSDCTab) setSelectedTab('bank');
    if (hideBankTab) setSelectedTab('usdc');
  }, [hideUSDCTab, hideBankTab]);

  const title = dueDate ? `Payment due by ${formatDate(dueDate)}` : 'Payment due';
  const description = buildDescription(selectedTab, bankDetails?.rail);

  return (
    <Card className='max-w-lg'>
      <Tabs
        defaultValue={selectedTab}
        value={selectedTab}
        onValueChange={(v) => setSelectedTab(v as TabType)}
        className='w-full'
      >
        <TabsList className='w-full justify-around rounded-b-none'>
          {!hideUSDCTab && (
            <TabsTrigger
              className='flex-1'
              value='usdc'
              disabled={isLoading || hideBankTab}
            >
              Pay via USDC
            </TabsTrigger>
          )}
          {!hideBankTab && (
            <TabsTrigger
              className='flex-1'
              value='bank'
              disabled={isLoading || hideUSDCTab}
            >
              Pay via Bank
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
                  transition={{ duration: 0.075 }}
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
            {!isLoading && hasUsdc && address && (
              <PaymentMethodUSDC address={address} />
            )}
          </TabsContent>
          <TabsContent
            value='bank'
            className='animate-in fade-in-0 slide-in-from-top-1'
          >
            {!isLoading && bankDetails && (
              <BankPaymentByRail bankDetails={bankDetails} />
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

// ─── Bank rail renderer ───────────────────────────────────────────────────────

const RAIL_ICON: Record<string, React.ElementType> = {
  usd_ach: BadgeDollarSign,
  usd_wire: BadgeDollarSign,
  usd_swift: BadgeDollarSign,
  eur_sepa: Landmark,
  eur_swift: Landmark,
  aed_local: Landmark,
};

const RAIL_TITLE: Record<string, string> = {
  usd_ach: 'USD Bank (ACH)',
  usd_wire: 'USD Bank (Wire)',
  usd_swift: 'USD Bank (SWIFT)',
  eur_sepa: 'EUR Bank (SEPA)',
  eur_swift: 'EUR Bank (SWIFT)',
  aed_local: 'AED Bank (Local Transfer)',
};

const RAIL_TOOLTIP: Record<string, string> = {
  usd_ach: 'Send USD via ACH to this bank account to pay this invoice',
  usd_wire: 'Send USD via Wire to this bank account to pay this invoice',
  usd_swift: 'Send USD via SWIFT to this bank account to pay this invoice',
  eur_sepa: 'Send EUR via SEPA to this bank account to pay this invoice',
  eur_swift: 'Send EUR via SWIFT to this bank account to pay this invoice',
  aed_local: 'Send AED via local transfer to this bank account to pay this invoice',
};

/** Switch on the rail and render the matching RailDisplay component */
const BankPaymentByRail = ({ bankDetails }: { bankDetails: DueBankDetailsForRail }) => {
  const Icon = RAIL_ICON[bankDetails.rail] ?? Landmark;
  const title = RAIL_TITLE[bankDetails.rail] ?? 'Bank';
  const tooltip = RAIL_TOOLTIP[bankDetails.rail];

  let content: React.ReactNode;
  switch (bankDetails.rail) {
    case 'usd_ach':
      content = <RailDisplay.ACH data={bankDetails.data} />;
      break;
    case 'usd_wire':
      content = <RailDisplay.Wire data={bankDetails.data} />;
      break;
    case 'usd_swift':
      content = <RailDisplay.SWIFTUSD data={bankDetails.data} />;
      break;
    case 'eur_sepa':
      content = <RailDisplay.SEPA data={bankDetails.data} />;
      break;
    case 'eur_swift':
      content = <RailDisplay.SWIFTEUR data={bankDetails.data} />;
      break;
    case 'aed_local':
      content = <RailDisplay.AEDLocal data={bankDetails.data} />;
      break;
  }

  return (
    <PaymentMethod
      title={title}
      Icon={Icon}
      timing={PAYMENT_TIMING_DESCRIPTIONS.bank}
      tooltip={tooltip}
    >
      {content}
    </PaymentMethod>
  );
};

// ─── USDC ─────────────────────────────────────────────────────────────────────

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
        <div className='relative size-48'>
          <div
            ref={qrCodeRef}
            className={isLoadingQRCode ? 'opacity-0' : 'opacity-100'}
          />
          {isLoadingQRCode && (
            <Skeleton className='absolute inset-0 size-48' />
          )}
        </div>
      </Card>
      <BaseAlert
        description='This address can only receive USDC on the Base Network. Funds may be lost if USDC is sent on another network.'
        className='text-muted-foreground'
      />
    </PaymentMethod>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PaymentMethodSkeleton = () => (
  <PaymentMethod title={<Skeleton className='h-5 w-40' />} Icon={Skeleton}>
    <Skeleton className='h-60 w-full' />
    <Skeleton className='h-20 w-full' />
  </PaymentMethod>
);

// ─── Description builder ──────────────────────────────────────────────────────

const RAIL_DESCRIPTION: Record<string, string> = {
  usd_ach: 'Transfer via ACH',
  usd_wire: 'Transfer via Wire',
  usd_swift: 'Transfer via SWIFT',
  eur_sepa: 'Transfer via SEPA',
  eur_swift: 'Transfer via SWIFT',
  aed_local: 'Local AED transfer',
};

const buildDescription = (tab: TabType, rail?: string) => {
  if (tab === 'usdc') return 'Send USDC on Base network';
  if (rail && RAIL_DESCRIPTION[rail]) return RAIL_DESCRIPTION[rail];
  return 'Transfer via bank';
};
