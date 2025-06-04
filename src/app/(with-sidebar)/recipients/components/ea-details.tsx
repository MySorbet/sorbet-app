import { PropsWithChildren } from 'react';
import { FC } from 'react';

import { formatWalletAddress } from '@/lib/utils';

/**
 * Render external account details as a series of rows
 */
export const EADetails = ({ account }: { account: Account }) => {
  switch (account.type) {
    case 'crypto':
      return <CryptoAccountDetails account={account} />;
    case 'usd':
      return <USDAccountDetails account={account} />;
    case 'eur':
      return <div>EUR not implemented</div>;
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
        <EARowValue>{formatWalletAddress(account.walletAddress)}</EARowValue>
      </EARow>
    </div>
  );
};

/** Local composition to render USD account details */
const USDAccountDetails = ({ account }: { account: USDAccount }) => {
  const accountType =
    account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1);
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
        <EARowValue>{accountType}</EARowValue>
      </EARow>
      <EARow>
        <EARowLabel>Account</EARowLabel>
        <EARowValue>****{account.accountNumberLast4}</EARowValue>
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

const EARowValue: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className='flex max-w-[70%] items-center gap-1 text-sm'>
      {children}
    </span>
  );
};

// Supporting types 👇

type BaseAccount = {
  name: string;
  type: 'usd' | 'eur' | 'crypto';
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

// TODO: Add EUR account
type EURAccount = BaseAccount & {
  type: 'eur';
  accountNumberLast4: string;
  // bic?
  // country?
};

type Account = USDAccount | CryptoAccount | EURAccount;
