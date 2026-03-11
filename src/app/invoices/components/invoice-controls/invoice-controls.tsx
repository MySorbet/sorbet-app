import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { NewInvoiceTab } from './new-invoice-tab';
import { PaymentTab } from './payment-tab';
import { YourInfoTab } from './your-info-tab';

/** Renders 3 tabs of controls for creating an invoice */
export const InvoiceControls = ({
  isBaseEndorsed,
  isEurEndorsed,
  isAedEndorsed,
  isDueVerified,
  onGetVerified,
  onClaimAccount,
  walletAddress,
  stellarWalletAddress,
}: {
  isBaseEndorsed?: boolean;
  isEurEndorsed?: boolean;
  /** Whether the user is endorsed for AED payments. `undefined` means still loading. */
  isAedEndorsed?: boolean;
  /** Whether the user has passed Due KYC. Distinct from per-currency endorsements. */
  isDueVerified?: boolean;
  onGetVerified?: (currency: 'usd' | 'eur' | 'aed') => void;
  /** Callback indicating the user wants to claim an account for a specific currency */
  onClaimAccount?: (currency: 'usd' | 'eur' | 'aed') => void;
  walletAddress?: string;
  stellarWalletAddress?: string;
}) => {
  const [activeTab, setActiveTab] = useState('invoice');
  // Each flag unlocks the next tab once the user passes through via "Save & Next".
  // After unlocking, all tabs remain freely navigable.
  const [hasCompletedTab1, setHasCompletedTab1] = useState(false);
  const [hasCompletedTab2, setHasCompletedTab2] = useState(false);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='flex h-full w-[27rem] flex-col'>
      <TabsList className='w-full justify-between'>
        <TabsTrigger value='invoice' className='w-1/3'>
          New invoice
        </TabsTrigger>
        <TabsTrigger value='your-info' className='w-1/3' disabled={!hasCompletedTab1}>
          Your info
        </TabsTrigger>
        <TabsTrigger value='payment' className='w-1/3' disabled={!hasCompletedTab2}>
          Payment
        </TabsTrigger>
      </TabsList>
      <ScrollArea className='flex-1'>
        <TabsContent
          forceMount
          value='invoice'
          className='data-[state=inactive]:hidden animate-in fade-in-0 slide-in-from-right-5 p-1 pt-5'
        >
          <NewInvoiceTab
            onNext={() => {
              setHasCompletedTab1(true);
              setActiveTab('your-info');
            }}
          />
        </TabsContent>
        <TabsContent
          forceMount
          value='your-info'
          className='data-[state=inactive]:hidden animate-in fade-in-0 slide-in-from-right-5 p-1 pt-5'
        >
          <YourInfoTab
            onNext={() => {
              setHasCompletedTab2(true);
              setActiveTab('payment');
            }}
          />
        </TabsContent>
        <TabsContent
          forceMount
          value='payment'
          className='data-[state=inactive]:hidden animate-in fade-in-0 slide-in-from-right-5 p-1 pt-5'
        >
          <PaymentTab
            isBaseEndorsed={isBaseEndorsed}
            isEurEndorsed={isEurEndorsed}
            isAedEndorsed={isAedEndorsed}
            isDueVerified={isDueVerified}
            onGetVerified={onGetVerified}
            onClaimAccount={onClaimAccount}
            walletAddress={walletAddress}
            stellarWalletAddress={stellarWalletAddress}
          />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
