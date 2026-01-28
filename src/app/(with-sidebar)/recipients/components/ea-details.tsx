import { PropsWithChildren } from 'react';
import { FC } from 'react';

import { DuePaymentMethod, PAYMENT_METHOD_OPTIONS } from '@/api/recipients/types';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { cn, formatWalletAddress } from '@/lib/utils';

import { formatAccountNumber } from './utils';

/** Check if type is a Due payment method */
const isDuePaymentMethod = (type: string): type is DuePaymentMethod => {
  return PAYMENT_METHOD_OPTIONS.some((option) => option.id === type);
};

/**
 * Render external account details as a series of rows
 */
export const EADetails = ({ account }: { account: Account }) => {
  // Handle Due payment methods
  if (isDuePaymentMethod(account.type)) {
    return <DueAccountDetails account={account as DueAccount} />;
  }

  // Handle legacy types
  switch (account.type) {
    case 'crypto':
      return <CryptoAccountDetails account={account} />;
    case 'usd':
      return <USDAccountDetails account={account} />;
    case 'eur':
      return <EURAccountDetails account={account} />;
    default:
      return <GenericAccountDetails account={account} />;
  }
};

/** Local composition to render crypto account details */
const CryptoAccountDetails = ({ account }: { account: CryptoAccount }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Name</EARowLabel>
        <EARowValue>{account.name}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Currency</EARowLabel>
        <EARowValue>USDC</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Address</EARowLabel>
        <EARowValue>
          <CopyButton
            className='h-fit flex-row-reverse p-1 px-0 text-sm font-normal'
            stringToCopy={account.walletAddress}
            variant='link'
            copyIconClassName='text-muted-foreground'
          >
            {formatWalletAddress(account.walletAddress)}
          </CopyButton>
        </EARowValue>
      </EARow>
    </div>
  );
};

/** Local composition to render USD account details */
const USDAccountDetails = ({ account }: { account: USDAccount }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Name</EARowLabel>
        <EARowValue>{account.name}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Currency</EARowLabel>
        <EARowValue>{account.type.toUpperCase()}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Type</EARowLabel>
        <EARowValue className='capitalize'>{account.accountType}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Account</EARowLabel>
        <EARowValue>
          {formatAccountNumber(account.accountNumberLast4)}
        </EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Routing</EARowLabel>
        <EARowValue>{account.routingNumber}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Bank name</EARowLabel>
        <EARowValue>{account.bankName}</EARowValue>
      </EARow>
    </div>
  );
};

/** Local composition to render EUR account details */
const EURAccountDetails = ({ account }: { account: EURAccount }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Name</EARowLabel>
        <EARowValue>{account.name}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Currency</EARowLabel>
        <EARowValue>{account.type.toUpperCase()}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>IBAN</EARowLabel>
        <EARowValue>
          {formatAccountNumber(account.accountNumberLast4)}
        </EARowValue>
      </EARow>
      {account.bic && (
        <EARow>
          <EARowLabel>BIC</EARowLabel>
          <EARowValue>{account.bic}</EARowValue>
        </EARow>
      )}
      <EARow>
        <EARowLabel>Country</EARowLabel>
        <EARowValue>{account.country}</EARowValue>
      </EARow>
    </div>
  );
};

/** Local composition to render Due Network account details */
const DueAccountDetails = ({ account }: { account: DueAccount }) => {
  const method = PAYMENT_METHOD_OPTIONS.find((m) => m.id === account.type);
  const label = method?.label ?? account.type.toUpperCase();
  const currency = method?.currency ?? '';

  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Name</EARowLabel>
        <EARowValue>{account.name}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Payment Method</EARowLabel>
        <EARowValue>{label}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Currency</EARowLabel>
        <EARowValue>{currency}</EARowValue>
      </EARow>
      {account.accountNumberLast4 && (
        <EARow>
          <EARowLabel>Account</EARowLabel>
          <EARowValue>
            {formatAccountNumber(account.accountNumberLast4)}
          </EARowValue>
        </EARow>
      )}
      {account.iban && (
        <EARow>
          <EARowLabel>IBAN</EARowLabel>
          <EARowValue>
            {formatAccountNumber(account.iban.slice(-4))}
          </EARowValue>
        </EARow>
      )}
      {account.swiftCode && (
        <EARow>
          <EARowLabel>SWIFT/BIC</EARowLabel>
          <EARowValue>{account.swiftCode}</EARowValue>
        </EARow>
      )}
      {account.routingNumber && (
        <EARow>
          <EARowLabel>Routing</EARowLabel>
          <EARowValue>{account.routingNumber}</EARowValue>
        </EARow>
      )}
    </div>
  );
};

/** Generic fallback for unknown account types */
const GenericAccountDetails = ({ account }: { account: BaseAccount }) => {
  return (
    <div className='flex w-full flex-col gap-2'>
      <EARow>
        <EARowLabel>Name</EARowLabel>
        <EARowValue>{account.name}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Type</EARowLabel>
        <EARowValue>{account.type.toUpperCase()}</EARowValue>
      </EARow>
    </div>
  );
};

// 👇 Local components composed above to keep render DRY

const EARow: FC<PropsWithChildren> = ({ children }) => {
  return <div className='flex gap-2'>{children}</div>;
};

const EARowLabel: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className='text-muted-foreground min-w-[40%] text-sm'>
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

// Supporting types 👇

type BaseAccount = {
  name: string;
  type: string;
};

type USDAccount = BaseAccount & {
  type: 'usd';
  accountNumberLast4: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  bankName: string;
};

type CryptoAccount = BaseAccount & {
  type: 'crypto';
  walletAddress: string;
};

type EURAccount = BaseAccount & {
  type: 'eur';
  accountNumberLast4: string;
  bic?: string;
  country: string;
};

type DueAccount = BaseAccount & {
  type: DuePaymentMethod;
  accountNumberLast4?: string;
  iban?: string;
  swiftCode?: string;
  routingNumber?: string;
};

type Account = USDAccount | CryptoAccount | EURAccount | DueAccount;
