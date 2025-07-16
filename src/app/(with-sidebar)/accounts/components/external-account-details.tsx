import { PropsWithChildren } from 'react';
import { FC } from 'react';

import {
  ACHWireDetails,
  SEPADetails,
} from '@/app/invoices/hooks/use-ach-wire-details';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { cn } from '@/lib/utils';

/** Local composition to render USD account details */
const USDAccountDetails = ({ account }: { account: ACHWireDetails }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Currency</EARowLabel>
        <EARowValue>USD</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Account number</EARowLabel>
        <EARowValue>
          <Copy stringToCopy={account.accountNumber}>
            {account.accountNumber}
          </Copy>
        </EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Routing number</EARowLabel>
        <EARowValue>
          <Copy stringToCopy={account.routingNumber}>
            {account.routingNumber}
          </Copy>
        </EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Account type</EARowLabel>
        <EARowValue>Checking</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Beneficiary</EARowLabel>
        <EARowValue>
          {account.beneficiary.name}
          <br />
          {account.beneficiary.address}
        </EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Bank</EARowLabel>
        <EARowValue>
          {account.bank.name}
          <br />
          {account.bank.address}
        </EARowValue>
      </EARow>
    </div>
  );
};

/** Local composition to render EUR account details */
const EURAccountDetails = ({ account }: { account: SEPADetails }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Currency</EARowLabel>
        <EARowValue>EUR</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>IBAN</EARowLabel>
        <EARowValue>
          <Copy stringToCopy={account.iban}>{account.iban}</Copy>
        </EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>BIC</EARowLabel>
        <EARowValue>
          <Copy stringToCopy={account.bic}>{account.bic}</Copy>
        </EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Account holder</EARowLabel>
        <EARowValue>{account.accountHolderName}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Bank</EARowLabel>
        <EARowValue>
          {account.bank.name}
          <br />
          {account.bank.address}
        </EARowValue>
      </EARow>
    </div>
  );
};

export const ExternalAccountDetails = {
  USD: USDAccountDetails,
  EUR: EURAccountDetails,
};

// 👇 Local components composed above to keep render DRY

const EARow: FC<PropsWithChildren> = ({ children }) => {
  return <div className='flex gap-2'>{children}</div>;
};

const EARowLabel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className='text-muted-foreground min-w-[30%] text-sm'>
      {children}
    </span>
  );
};

const EARowValue: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <span
      className={cn('flex max-w-[70%] items-center gap-1 text-sm', className)}
    >
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
      className='h-fit flex-row-reverse p-0 text-sm font-normal'
      variant='link'
      copyIconClassName='text-muted-foreground'
    >
      {children}
    </CopyButton>
  );
};
