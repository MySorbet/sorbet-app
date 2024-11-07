import { CopyButton } from '@/app/invoices/components/dashboard/copy-button';

import { handleCopy } from './utils';
import { Label } from '@/components/ui/label';

type Beneficiary = {
  name: string;
  accountType: string;
  address: string;
};

type Bank = {
  name: string;
  address: string;
};

type InvoicePayAchWireProps = {
  isLoading?: boolean;
  routingNumber: string;
  accountNumber: string;
  beneficiary: Beneficiary;
  bank: Bank;
};

export const InvoicePayAchWire = ({
  isLoading,
  routingNumber,
  accountNumber,
  beneficiary,
  bank,
}: InvoicePayAchWireProps) => {
  return (
    <div className='flex max-w-[32rem] flex-col justify-center gap-6 rounded-xl bg-white p-4'>
      <span>Use these details to send domestic wires and ACH transfers</span>
      <div className='flex w-full justify-between gap-4'>
        <ACHWireCopyButton
          id='account-number'
          onCopy={() => handleCopy(accountNumber)}
          value={accountNumber}
          label='Account number'
        />
        <ACHWireCopyButton
          id='routing-number'
          onCopy={() => handleCopy(routingNumber)}
          value={routingNumber}
          label='Routing number'
        />
      </div>
      <Block label='Beneficiary'>
        <Detail label='Beneficiary name' value={beneficiary.name} />
        <Detail label='Account type' value={beneficiary.accountType} />
        <Detail label='Address' value={beneficiary.address} />
      </Block>
      <Block label='Receiving bank'>
        <Detail label='Bank name' value={bank.name} />
        <Detail label='Bank address' value={bank.address} />
      </Block>
    </div>
  );
};

/**
 * Local component for displaying a copy button for ach/wire details
 */
const ACHWireCopyButton = ({
  id,
  onCopy,
  value,
  label,
}: {
  id: string;
  onCopy: () => void;
  value: string;
  label: string;
}) => {
  return (
    <div>
      <Label htmlFor={id} className='text-muted-foreground font-normal'>
        {label}
      </Label>
      <CopyButton
        id={id}
        onCopy={onCopy}
        className='text-muted-foreground mt-2 min-w-56 flex-row-reverse justify-between font-normal'
        // TODO: Fix the color of the copy icon
      >
        {value}
      </CopyButton>
    </div>
  );
};

/**
 * Local component for displaying a block of ach/wire details
 */
const Block = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className='flex w-full flex-col gap-3'>
      <span className='text-sm font-medium'>{label}</span>
      {children}
    </div>
  );
};

/**
 * Local component for displaying rows of ach/wire details
 */
const Detail = ({ label, value }: { label: string; value?: string | null }) => {
  return (
    <div className='flex'>
      <span className='text-muted-foreground flex-1 text-xs'>{label}</span>
      <span className='flex-[2] text-xs'>{value}</span>
    </div>
  );
};
