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
  onGetVerified,
  walletAddress,
  stellarWalletAddress,
}: {
  isBaseEndorsed?: boolean;
  isEurEndorsed?: boolean;
  /** Whether the user is endorsed for AED payments. `undefined` means still loading. */
  isAedEndorsed?: boolean;
  onGetVerified?: (currency: 'usd' | 'eur' | 'aed') => void;
  walletAddress?: string;
  stellarWalletAddress?: string;
}) => {
  const [activeTab, setActiveTab] = useState('invoice');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='flex h-full w-[27rem] flex-col'>
      <TabsList className='w-full justify-between'>
        <TabsTrigger value='invoice' className='w-1/3'>
          New invoice
        </TabsTrigger>
        <TabsTrigger value='your-info' className='w-1/3'>
          Your info
        </TabsTrigger>
        <TabsTrigger value='payment' className='w-1/3'>
          Payment
        </TabsTrigger>
      </TabsList>
      <ScrollArea className='flex-1'>
        <TabsContent
          forceMount
          value='invoice'
          className='data-[state=inactive]:hidden animate-in fade-in-0 slide-in-from-right-5 p-1 pt-5'
        >
          <NewInvoiceTab onNext={() => setActiveTab('your-info')} />
        </TabsContent>
        <TabsContent
          forceMount
          value='your-info'
          className='data-[state=inactive]:hidden animate-in fade-in-0 slide-in-from-right-5 p-1 pt-5'
        >
          <YourInfoTab onNext={() => setActiveTab('payment')} />
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
            onGetVerified={onGetVerified}
            walletAddress={walletAddress}
            stellarWalletAddress={stellarWalletAddress}
          />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
