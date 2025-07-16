import { PropsWithChildren } from 'react';
import { FC } from 'react';

// TODO: Perhaps this hook should be moved?
import {
  ACHWireDetails,
  SEPADetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
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
const VADetailsUSD = ({ account }: { account: ACHWireDetails }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>Account number</VARowLabel>
        <VARowValue>
          {account.accountNumber}
          <CopyIconButton stringToCopy={account.accountNumber} />
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Routing number</VARowLabel>
        <VARowValue>
          {account.routingNumber}
          <CopyIconButton stringToCopy={account.routingNumber} />
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account type</VARowLabel>
        <VARowValue>{account.beneficiary.accountType}</VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Recipient</VARowLabel>
        <VARowValue>
          {account.beneficiary.name}
          <CopyIconButton stringToCopy={account.beneficiary.name} />
        </VARowValue>
      </VARow>
      <Accordion type='single' collapsible>
        <AccordionItem value='additional-details' className='border-none p-0'>
          <AccordionTrigger className='text-muted-foreground border-none p-0 pb-2 text-sm font-normal'>
            Additional details
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-2 p-0'>
            <VARow>
              <VARowLabel>Recipient address</VARowLabel>
              <VARowValue>{account.beneficiary.address}</VARowValue>
            </VARow>
            <VARow>
              <VARowLabel>Bank name</VARowLabel>
              <VARowValue>{account.bank.name}</VARowValue>
            </VARow>
            <VARow>
              <VARowLabel>Bank address</VARowLabel>
              <VARowValue>{account.bank.address}</VARowValue>
            </VARow>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

/**
 * Render eur virtual account details as a series of copyable rows with an accordion for additional details
 * - Compose this with `PaymentMethod`
 */
const VADetailsEUR = ({ account }: { account: SEPADetails }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>IBAN</VARowLabel>
        <VARowValue>
          {account.iban}
          <CopyIconButton stringToCopy={account.iban} />
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>BIC</VARowLabel>
        <VARowValue>
          {account.bic}
          <CopyIconButton stringToCopy={account.bic} />
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account Holder</VARowLabel>
        <VARowValue>
          {account.accountHolderName}
          <CopyIconButton stringToCopy={account.accountHolderName} />
        </VARowValue>
      </VARow>
      <Accordion type='single' collapsible>
        <AccordionItem value='additional-details' className='border-none p-0'>
          <AccordionTrigger className='text-muted-foreground border-none p-0 pb-2 text-sm font-normal'>
            Additional details
          </AccordionTrigger>
          <AccordionContent className='flex flex-col gap-2 p-0'>
            <VARow>
              <VARowLabel>Bank name</VARowLabel>
              <VARowValue>{account.bank.name}</VARowValue>
            </VARow>
            <VARow>
              <VARowLabel>Bank address</VARowLabel>
              <VARowValue>{account.bank.address}</VARowValue>
            </VARow>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const VirtualAccountDetails = {
  USD: VADetailsUSD,
  EUR: VADetailsEUR,
};

// 👇 Local components to keep virtual account render DRY

const VARow: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex items-center justify-between gap-2'>{children}</div>
  );
};

const VARowLabel: FC<PropsWithChildren> = ({ children }) => {
  return <span className='text-muted-foreground text-sm'>{children}</span>;
};

const VARowValue: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className='flex max-w-[70%] items-center gap-1 text-right text-sm'>
      {children}
    </span>
  );
};
