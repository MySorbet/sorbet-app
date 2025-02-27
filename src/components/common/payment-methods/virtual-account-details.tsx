import { PropsWithChildren } from 'react';
import { FC } from 'react';

// TODO: Perhaps this hook should be moved?
import { ACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Render virtual account details as a series of copyable rows with an accordion for additional details
 * - Compose this with `PaymentMethod`
 */
export const VirtualAccountDetails = ({
  account,
}: {
  account: ACHWireDetails;
}) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <VirtualAccountRow>
        <VirtualAccountRowLabel>Account number</VirtualAccountRowLabel>
        <VirtualAccountRowValue>
          {account.accountNumber}
          <CopyIconButton stringToCopy={account.accountNumber} />
        </VirtualAccountRowValue>
      </VirtualAccountRow>
      <VirtualAccountRow>
        <VirtualAccountRowLabel>Routing number</VirtualAccountRowLabel>
        <VirtualAccountRowValue>
          {account.routingNumber}
          <CopyIconButton stringToCopy={account.routingNumber} />
        </VirtualAccountRowValue>
      </VirtualAccountRow>
      <VirtualAccountRow>
        <VirtualAccountRowLabel>Account type</VirtualAccountRowLabel>
        <VirtualAccountRowValue>
          {account.beneficiary.accountType}
        </VirtualAccountRowValue>
      </VirtualAccountRow>
      <VirtualAccountRow>
        <VirtualAccountRowLabel>Recipient</VirtualAccountRowLabel>
        <VirtualAccountRowValue>
          {account.beneficiary.name}
          <CopyIconButton stringToCopy={account.beneficiary.name} />
        </VirtualAccountRowValue>
      </VirtualAccountRow>
      <Accordion type='single' collapsible>
        <AccordionItem value='additional-details' className='border-none p-0'>
          <AccordionTrigger className='text-muted-foreground border-none p-0 pb-2 text-sm font-normal'>
            Additional details
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-2 p-0'>
            <VirtualAccountRow>
              <VirtualAccountRowLabel>Recipient address</VirtualAccountRowLabel>
              <VirtualAccountRowValue>
                {account.beneficiary.address}
              </VirtualAccountRowValue>
            </VirtualAccountRow>
            <VirtualAccountRow>
              <VirtualAccountRowLabel>Bank name</VirtualAccountRowLabel>
              <VirtualAccountRowValue>
                {account.bank.name}
              </VirtualAccountRowValue>
            </VirtualAccountRow>
            <VirtualAccountRow>
              <VirtualAccountRowLabel>Bank address</VirtualAccountRowLabel>
              <VirtualAccountRowValue>
                {account.bank.address}
              </VirtualAccountRowValue>
            </VirtualAccountRow>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// 👇 Local components to keep virtual account render DRY

const VirtualAccountRow: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex items-center justify-between gap-2'>{children}</div>
  );
};

const VirtualAccountRowLabel: FC<PropsWithChildren> = ({ children }) => {
  return <span className='text-muted-foreground text-sm'>{children}</span>;
};

const VirtualAccountRowValue: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className='flex max-w-[70%] items-center gap-1 text-right text-sm'>
      {children}
    </span>
  );
};
