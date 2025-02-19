import { YourInfo } from '@/app/invoices/v2/your-info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { NewInvoice } from './new-invoice';

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
        <TabsContent value='invoice'>
          <NewInvoice />
        </TabsContent>
        <TabsContent value='your-info'>
          <YourInfo />
        </TabsContent>
        <TabsContent value='payment'></TabsContent>
      </Tabs>
    </div>
  );
};
