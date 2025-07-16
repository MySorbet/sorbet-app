import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { NewInvoiceTab } from './new-invoice-tab';
import { PaymentTab } from './payment-tab';
import { YourInfoTab } from './your-info-tab';

/** Renders 3 tabs of controls for creating an invoice */
export const InvoiceControls = ({
  isBaseEndorsed,
  isEurEndorsed,
  onGetVerified,
  walletAddress,
}: {
  isBaseEndorsed?: boolean;
  isEurEndorsed?: boolean;
  onGetVerified?: (currency: 'usd' | 'eur') => void;
  walletAddress?: string;
}) => {
  return (
    <div>
      <Tabs defaultValue='invoice' className='w-96'>
        <TabsList className='mb-10 w-full justify-between'>
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
        <TabsContent
          value='invoice'
          className='animate-in fade-in-0 slide-in-from-right-5'
        >
          <NewInvoiceTab />
        </TabsContent>
        <TabsContent
          value='your-info'
          className='animate-in fade-in-0 slide-in-from-right-5'
        >
          <YourInfoTab />
        </TabsContent>
        <TabsContent
          value='payment'
          className='animate-in fade-in-0 slide-in-from-right-5'
        >
          <PaymentTab
            isBaseEndorsed={isBaseEndorsed}
            isEurEndorsed={isEurEndorsed}
            onGetVerified={onGetVerified}
            walletAddress={walletAddress}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
