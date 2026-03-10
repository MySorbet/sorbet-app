'use client';

import { EmailSection } from './email-section';
import { InvoicingSection } from './invoicing-section';
import { VirtualBankSection } from './virtual-bank-section';
import { WalletSection } from './wallet-section';

export const AccountTab = () => {
  return (
    <div className='flex w-full min-w-fit flex-col gap-6'>
      <EmailSection />
      <WalletSection />
      <VirtualBankSection />
      <InvoicingSection />
    </div>
  );
};
