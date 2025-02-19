import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { NewInvoice } from './new-invoice';
import { YourInfo } from './your-info';

export const InvoiceControls = () => {
  return (
    <div>
      <Tabs defaultValue='invoice' className='w-96'>
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
        <TabsContent
          value='invoice'
          className='animate-in fade-in-0 slide-in-from-right-5'
        >
          <NewInvoice />
        </TabsContent>
        <TabsContent
          value='your-info'
          className='animate-in fade-in-0 slide-in-from-right-5'
        >
          <YourInfo />
        </TabsContent>
        <TabsContent
          value='payment'
          className='animate-in fade-in-0 slide-in-from-right-5'
        ></TabsContent>
      </Tabs>
    </div>
  );
};
