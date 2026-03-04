import { PropsWithChildren } from 'react';
import { FC } from 'react';

// TODO: Perhaps this hook should be moved?
import {
  ACHWireDetails,
  SEPADetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
import type {
  DueVirtualAccountAEDDetails,
  DueVirtualAccountEURDetails,
  DueVirtualAccountSWIFTDetails,
  DueVirtualAccountUSDetails,
} from '@/types/due';
import { CopyButton } from '@/components/common/copy-button/copy-button';
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
          <Copy stringToCopy={account.accountNumber}>{account.accountNumber}</Copy>
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Routing number</VARowLabel>
        <VARowValue>
          <Copy stringToCopy={account.routingNumber}>{account.routingNumber}</Copy>
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account type</VARowLabel>
        <VARowValue>{account.beneficiary.accountType}</VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Recipient</VARowLabel>
        <VARowValue>
          <Copy stringToCopy={account.beneficiary.name}>{account.beneficiary.name}</Copy>
        </VARowValue>
      </VARow>
      <AdditionalDetails>
        <VARow><VARowLabel>Recipient address</VARowLabel><VARowValue>{account.beneficiary.address}</VARowValue></VARow>
        <VARow><VARowLabel>Bank name</VARowLabel><VARowValue>{account.bank.name}</VARowValue></VARow>
        <VARow><VARowLabel>Bank address</VARowLabel><VARowValue>{account.bank.address}</VARowValue></VARow>
      </AdditionalDetails>
    </div>
  );
};

/**
 * Render EUR virtual account details as a series of copyable rows.
 * Compose this with `PaymentMethod`.
 */
const VADetailsEUR = ({ account }: { account: SEPADetails }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>IBAN</VARowLabel>
        <VARowValue>
          <Copy stringToCopy={account.iban}><span className='truncate'>{account.iban}</span></Copy>
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>BIC</VARowLabel>
        <VARowValue>
          <Copy stringToCopy={account.bic}><span className='truncate'>{account.bic}</span></Copy>
        </VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account Holder</VARowLabel>
        <VARowValue>
          <Copy stringToCopy={account.accountHolderName}><span className='truncate'>{account.accountHolderName}</span></Copy>
        </VARowValue>
      </VARow>
      <AdditionalDetails>
        <VARow><VARowLabel>Bank name</VARowLabel><VARowValue>{account.bank.name}</VARowValue></VARow>
        <VARow><VARowLabel>Bank address</VARowLabel><VARowValue>{account.bank.address}</VARowValue></VARow>
      </AdditionalDetails>
    </div>
  );
};

// ─── Rail-specific display components ────────────────────────────────────────
// Each component shows ONLY the fields guaranteed to exist for that rail.

/** USD ACH: routing number (ACH), account number, account type, recipient */
const RAILDisplayACH = ({ data }: { data: DueVirtualAccountUSDetails }) => {
  const name = data.accountName ?? [data.firstName, data.lastName].filter(Boolean).join(' ');
  const routing = data.routingNumberACH ?? data.routingNumber;
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>Account number</VARowLabel>
        <VARowValue><Copy stringToCopy={data.accountNumber}>{data.accountNumber}</Copy></VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>ACH routing number</VARowLabel>
        <VARowValue><Copy stringToCopy={routing}>{routing}</Copy></VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account type</VARowLabel>
        <VARowValue>{data.accountType === 'business' ? 'Business' : 'Checking'}</VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Recipient</VARowLabel>
        <VARowValue><Copy stringToCopy={name}>{name}</Copy></VARowValue>
      </VARow>
      <AdditionalDetails>
        <VARow><VARowLabel>Bank name</VARowLabel><VARowValue>{data.bankName}</VARowValue></VARow>
        {data.bankAddress && <VARow><VARowLabel>Bank address</VARowLabel><VARowValue>{data.bankAddress}</VARowValue></VARow>}
      </AdditionalDetails>
    </div>
  );
};

/** USD Wire: routing number (Wire), account number, account type, recipient */
const RAILDisplayWire = ({ data }: { data: DueVirtualAccountUSDetails }) => {
  const name = data.accountName ?? [data.firstName, data.lastName].filter(Boolean).join(' ');
  const routing = data.routingNumberWire ?? data.routingNumber;
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>Account number</VARowLabel>
        <VARowValue><Copy stringToCopy={data.accountNumber}>{data.accountNumber}</Copy></VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Wire routing number</VARowLabel>
        <VARowValue><Copy stringToCopy={routing}>{routing}</Copy></VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account type</VARowLabel>
        <VARowValue>{data.accountType === 'business' ? 'Business' : 'Checking'}</VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Recipient</VARowLabel>
        <VARowValue><Copy stringToCopy={name}>{name}</Copy></VARowValue>
      </VARow>
      <AdditionalDetails>
        <VARow><VARowLabel>Bank name</VARowLabel><VARowValue>{data.bankName}</VARowValue></VARow>
        {data.bankAddress && <VARow><VARowLabel>Bank address</VARowLabel><VARowValue>{data.bankAddress}</VARowValue></VARow>}
      </AdditionalDetails>
    </div>
  );
};

/** USD SWIFT: SWIFT code, account number, bank name, recipient */
const RAILDisplaySWIFTUSD = ({ data }: { data: DueVirtualAccountSWIFTDetails }) => {
  const name = data.companyName ?? [data.firstName, data.lastName].filter(Boolean).join(' ');
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>SWIFT / BIC</VARowLabel>
        <VARowValue><Copy stringToCopy={data.swiftCode}>{data.swiftCode}</Copy></VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Account number</VARowLabel>
        <VARowValue><Copy stringToCopy={data.swiftAccountNumber}>{data.swiftAccountNumber}</Copy></VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Bank name</VARowLabel>
        <VARowValue>{data.bankName}</VARowValue>
      </VARow>
      <VARow>
        <VARowLabel>Recipient</VARowLabel>
        <VARowValue><Copy stringToCopy={name}>{name}</Copy></VARowValue>
      </VARow>
    </div>
  );
};

/** EUR SEPA: IBAN, BIC, account holder */
const RAILDisplaySEPA = ({ data }: { data: DueVirtualAccountEURDetails }) => {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.companyName || '';
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>IBAN</VARowLabel>
        <VARowValue><Copy stringToCopy={data.IBAN}><span className='truncate'>{data.IBAN}</span></Copy></VARowValue>
      </VARow>
      {data.swiftCode && (
        <VARow>
          <VARowLabel>BIC</VARowLabel>
          <VARowValue><Copy stringToCopy={data.swiftCode}>{data.swiftCode}</Copy></VARowValue>
        </VARow>
      )}
      <VARow>
        <VARowLabel>Account holder</VARowLabel>
        <VARowValue><Copy stringToCopy={name}>{name}</Copy></VARowValue>
      </VARow>
      {data.bankName && (
        <AdditionalDetails>
          <VARow><VARowLabel>Bank name</VARowLabel><VARowValue>{data.bankName}</VARowValue></VARow>
        </AdditionalDetails>
      )}
    </div>
  );
};

/** EUR SWIFT: IBAN, SWIFT code (labeled SWIFT Code), account holder */
const RAILDisplaySWIFTEUR = ({ data }: { data: DueVirtualAccountEURDetails }) => {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.companyName || '';
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>IBAN</VARowLabel>
        <VARowValue><Copy stringToCopy={data.IBAN}><span className='truncate'>{data.IBAN}</span></Copy></VARowValue>
      </VARow>
      {data.swiftCode && (
        <VARow>
          <VARowLabel>SWIFT code</VARowLabel>
          <VARowValue><Copy stringToCopy={data.swiftCode}>{data.swiftCode}</Copy></VARowValue>
        </VARow>
      )}
      <VARow>
        <VARowLabel>Account holder</VARowLabel>
        <VARowValue><Copy stringToCopy={name}>{name}</Copy></VARowValue>
      </VARow>
      {data.bankName && (
        <AdditionalDetails>
          <VARow><VARowLabel>Bank name</VARowLabel><VARowValue>{data.bankName}</VARowValue></VARow>
        </AdditionalDetails>
      )}
    </div>
  );
};

/** AED Local: IBAN, bank name, account holder — no BIC (local transfer) */
const RAILDisplayAEDLocal = ({ data }: { data: DueVirtualAccountAEDDetails }) => {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.companyName || '';
  const address = data.beneficiaryAddress
    ? [
        data.beneficiaryAddress.street_line_1,
        data.beneficiaryAddress.city,
        data.beneficiaryAddress.country,
      ].filter(Boolean).join(', ')
    : undefined;
  return (
    <div className='flex w-full flex-col gap-2'>
      <VARow>
        <VARowLabel>IBAN</VARowLabel>
        <VARowValue><Copy stringToCopy={data.IBAN}><span className='truncate'>{data.IBAN}</span></Copy></VARowValue>
      </VARow>
      {data.bankName && (
        <VARow>
          <VARowLabel>Bank name</VARowLabel>
          <VARowValue>{data.bankName}</VARowValue>
        </VARow>
      )}
      <VARow>
        <VARowLabel>Account holder</VARowLabel>
        <VARowValue><Copy stringToCopy={name}>{name}</Copy></VARowValue>
      </VARow>
      {address && (
        <AdditionalDetails>
          <VARow><VARowLabel>Beneficiary address</VARowLabel><VARowValue>{address}</VARowValue></VARow>
        </AdditionalDetails>
      )}
    </div>
  );
};

export const VirtualAccountDetails = {
  USD: VADetailsUSD,
  EUR: VADetailsEUR,
};

/** Rail-specific display components. Each shows exactly the fields for that rail. */
export const RailDisplay = {
  ACH: RAILDisplayACH,
  Wire: RAILDisplayWire,
  SWIFTUSD: RAILDisplaySWIFTUSD,
  SEPA: RAILDisplaySEPA,
  SWIFTEUR: RAILDisplaySWIFTEUR,
  AEDLocal: RAILDisplayAEDLocal,
};

// 👇 Local components to keep virtual account render DRY

/** Collapsible "Additional details" accordion shared by all rail components */
const AdditionalDetails: FC<PropsWithChildren> = ({ children }) => (
  <Accordion type='single' collapsible>
    <AccordionItem value='additional-details' className='border-none p-0'>
      <AccordionTrigger className='text-muted-foreground border-none p-0 pb-2 text-sm font-normal'>
        Additional details
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-2 p-0'>
        {children}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

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

/** Common CopyButton customized for copyable info */
const Copy = ({
  children,
  stringToCopy,
}: {
  stringToCopy: string;
  children: React.ReactNode;
}) => {
  return (
    <CopyButton
      stringToCopy={stringToCopy}
      className='h-fit w-full flex-row-reverse p-0 text-sm font-normal'
      variant='link'
      copyIconClassName='text-muted-foreground'
    >
      {children}
    </CopyButton>
  );
};
