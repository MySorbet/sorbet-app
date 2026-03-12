'use client';

import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CircleFlag } from 'react-circle-flags';

import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Spinner } from '@/components/common/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import {
  type PublicAccount,
  type PublicAccountUser,
  getPublicAccountsByHandle,
} from '../api';

// Schema to currency/country mapping
const SCHEMA_CONFIG: Record<
  string,
  { currency: string; label: string; countryCode: string; isCustomIcon?: boolean }
> = {
  bank_us: { currency: 'USD', label: 'US Dollar', countryCode: 'us' },
  bank_sepa: { currency: 'EUR', label: 'Euro', countryCode: 'eu' },
  bank_mena: {
    currency: 'AED',
    label: 'UAE Dirham',
    countryCode: 'ae',
    isCustomIcon: true,
  },
  bank_swift_usd: {
    currency: 'USD',
    label: 'USD (SWIFT)',
    countryCode: 'us',
  },
};

/**
 * Public accounts page content.
 * Shows a user's bank account details in a clean, shareable format.
 */
export const PublicAccountsContent = ({
  handle,
}: {
  handle: string;
}) => {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['publicAccounts', handle],
    queryFn: () => getPublicAccountsByHandle(handle),
    retry: (_, error) => !(isAxiosError(error) && error.status === 404),
  });

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Spinner className='size-8' />
      </div>
    );
  }

  if (isError || !data) {
    return <NotFoundState handle={handle} />;
  }

  const { user, accounts } = data;

  // Filter out the internal SWIFT companion (shown inline under USD)
  const visibleAccounts = accounts.filter((a) => a.schema !== 'bank_swift_usd');
  const swiftAccount = accounts.find((a) => a.schema === 'bank_swift_usd');

  if (visibleAccounts.length === 0) {
    return <EmptyState user={user} />;
  }

  return (
    <div className='relative min-h-screen bg-background'>
      {/* Subtle gradient background */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute -left-1/4 -top-1/4 size-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl' />
        <div className='absolute -bottom-1/4 -right-1/4 size-[600px] rounded-full bg-gradient-to-tl from-primary/5 to-transparent blur-3xl' />
      </div>

      <div className='relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12'>
        {/* User Header */}
        <UserHeader user={user} />

        {/* Accounts */}
        <div className='mt-8 space-y-4'>
          {visibleAccounts.map((account) => (
            <AccountCard
              key={account.schema}
              account={account}
              swiftAccount={
                account.schema === 'bank_us' ? swiftAccount : undefined
              }
            />
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

// ============ User Header ============

const UserHeader = ({ user }: { user: PublicAccountUser }) => {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.handle;
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || user.handle[0]?.toUpperCase();

  return (
    <div className='flex flex-col items-center gap-4 text-center'>
      <Avatar className='size-20 border-2 border-border shadow-sm'>
        <AvatarImage src={user.profileImage ?? undefined} alt={displayName} />
        <AvatarFallback className='text-lg font-medium'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>{displayName}</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          @{user.handle} · Bank Accounts
        </p>
      </div>
    </div>
  );
};

// ============ Account Card ============

const AccountCard = ({
  account,
  swiftAccount,
}: {
  account: PublicAccount;
  swiftAccount?: PublicAccount;
}) => {
  const config = SCHEMA_CONFIG[account.schema];
  if (!config) return null;

  const details = account.details as Record<string, unknown>;
  const swiftDetails = swiftAccount?.details as Record<string, unknown> | undefined;

  return (
    <div className='overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md'>
      {/* Card Header */}
      <div className='flex items-center justify-between border-b bg-muted/30 px-5 py-4'>
        <div className='flex items-center gap-3'>
          {config.isCustomIcon ? (
            <Image
              src='/svg/AED-icon.svg'
              alt={`${config.currency} flag`}
              width={36}
              height={36}
              className='size-9'
            />
          ) : (
            <CircleFlag countryCode={config.countryCode} className='size-9' />
          )}
          <div>
            <h3 className='font-semibold'>{config.currency} Account</h3>
            <p className='text-muted-foreground text-xs'>{config.label}</p>
          </div>
        </div>
        <CopyAllDetailsButton
          details={details}
          currency={config.currency}
          swiftDetails={swiftDetails}
        />
      </div>

      {/* Card Body */}
      <div className='px-5 py-4'>
        <AccountDetailsView
          schema={account.schema}
          details={details}
          swiftDetails={swiftDetails}
        />
      </div>
    </div>
  );
};

// ============ Account Details Views ============

const AccountDetailsView = ({
  schema,
  details,
  swiftDetails,
}: {
  schema: string;
  details: Record<string, unknown>;
  swiftDetails?: Record<string, unknown>;
}) => {
  switch (schema) {
    case 'bank_us':
      return <USDDetails details={details} swiftDetails={swiftDetails} />;
    case 'bank_sepa':
      return <EURDetails details={details} />;
    case 'bank_mena':
      return <AEDDetails details={details} />;
    default:
      return null;
  }
};

const USDDetails = ({
  details,
  swiftDetails,
}: {
  details: Record<string, unknown>;
  swiftDetails?: Record<string, unknown>;
}) => {
  const [tab, setTab] = useState<'ach' | 'wire' | 'swift'>('ach');
  const beneficiaryName = getBeneficiaryName(details);
  const beneficiaryAddress = getBeneficiaryAddress(details);

  return (
    <div className='space-y-4'>
      {/* Transfer type tabs */}
      <div className='flex gap-1 rounded-lg bg-muted p-1'>
        {(['ach', 'wire', 'swift'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium uppercase transition-colors',
              tab === t
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'swift' && swiftDetails ? (
        <div className='space-y-2'>
          <DetailRow label='Account Number' value={String(swiftDetails.swiftAccountNumber ?? '')} copyable />
          <DetailRow label='SWIFT / BIC Code' value={String(swiftDetails.swiftCode ?? '')} copyable />
          <DetailRow label='Beneficiary' value={getBeneficiaryName(swiftDetails)} />
          {getBeneficiaryAddress(swiftDetails) && (
            <DetailRow label='Address' value={getBeneficiaryAddress(swiftDetails)} />
          )}
          <DetailRow label='Bank' value={String(swiftDetails.bankName ?? '')} />
        </div>
      ) : tab === 'swift' && !swiftDetails ? (
        <p className='py-4 text-center text-sm text-muted-foreground'>
          SWIFT details not available
        </p>
      ) : (
        <div className='space-y-2'>
          <DetailRow label='Account Number' value={String(details.accountNumber ?? '')} copyable />
          <DetailRow
            label={tab === 'ach' ? 'ACH Routing Number' : 'WIRE Routing Number'}
            value={String(
              tab === 'ach'
                ? (details.routingNumberACH ?? details.routingNumber ?? '')
                : (details.routingNumberWire ?? details.routingNumber ?? '')
            )}
            copyable
          />
          <DetailRow label='Account Type' value='Checking' />
          <DetailRow label='Beneficiary' value={beneficiaryName} />
          {beneficiaryAddress && <DetailRow label='Address' value={beneficiaryAddress} />}
          <DetailRow label='Bank' value={String(details.bankName ?? '')} />
          {!!details.bankAddress && (
            <DetailRow label='Bank Address' value={String(details.bankAddress)} />
          )}
        </div>
      )}
    </div>
  );
};

const EURDetails = ({ details }: { details: Record<string, unknown> }) => {
  const holderName = getBeneficiaryName(details);

  return (
    <div className='space-y-2'>
      <DetailRow label='IBAN' value={String(details.IBAN ?? '')} copyable />
      {!!details.swiftCode && (
        <DetailRow label='SWIFT / BIC Code' value={String(details.swiftCode)} copyable />
      )}
      <DetailRow label='Account Holder' value={holderName} />
      {!!details.bankName && <DetailRow label='Bank' value={String(details.bankName)} />}
    </div>
  );
};

const AEDDetails = ({ details }: { details: Record<string, unknown> }) => {
  const holderName = getBeneficiaryName(details);
  const beneficiaryAddress = getBeneficiaryAddress(details);

  return (
    <div className='space-y-2'>
      <DetailRow label='IBAN' value={String(details.IBAN ?? '')} copyable />
      {!!details.swiftCode && (
        <DetailRow label='SWIFT Code' value={String(details.swiftCode)} copyable />
      )}
      <DetailRow label='Account Holder' value={holderName} />
      {!!beneficiaryAddress && <DetailRow label='Address' value={beneficiaryAddress} />}
      {!!details.bankName && <DetailRow label='Bank' value={String(details.bankName)} />}
    </div>
  );
};

// ============ Helper Components ============

const DetailRow = ({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) => {
  if (!value) return null;

  return (
    <div className='flex gap-2'>
      <span className='min-w-[40%] text-sm text-muted-foreground'>{label}</span>
      <span className='flex max-w-[60%] items-center gap-1 text-sm'>
        {copyable ? (
          <CopyButton
            stringToCopy={value}
            className='h-fit flex-row-reverse p-0 text-sm font-normal'
            variant='link'
            copyIconClassName='text-muted-foreground'
          >
            {value}
          </CopyButton>
        ) : (
          value
        )}
      </span>
    </div>
  );
};

const CopyAllDetailsButton = ({
  details,
  currency,
  swiftDetails,
}: {
  details: Record<string, unknown>;
  currency: string;
  swiftDetails?: Record<string, unknown>;
}) => {
  const allText = buildCopyText(details, currency, swiftDetails);

  return (
    <CopyButton
      stringToCopy={allText}
      variant='outline'
      size='sm'
      className='h-8 gap-1.5 text-xs'
    >
      Copy
    </CopyButton>
  );
};

// ============ States ============

const NotFoundState = ({ handle }: { handle: string }) => (
  <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
    <h1 className='text-2xl font-semibold'>User not found</h1>
    <p className='text-muted-foreground mt-2 text-sm'>
      No accounts found for @{handle}
    </p>
    <Link
      href='/'
      className='text-primary mt-4 text-sm underline underline-offset-4 hover:text-primary/80'
    >
      Go to Sorbet
    </Link>
  </div>
);

const EmptyState = ({ user }: { user: PublicAccountUser }) => {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.handle;

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
      <h1 className='text-2xl font-semibold'>{displayName}</h1>
      <p className='text-muted-foreground mt-2 text-sm'>
        No bank accounts have been set up yet
      </p>
    </div>
  );
};

const Footer = () => (
  <div className='mt-12 flex flex-col items-center gap-2 pb-8'>
    <Link href='/' className='group flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100'>
      <Image
        src='/svg/sorbet-logo.svg'
        alt='Sorbet'
        width={20}
        height={20}
        className='size-5'
      />
      <span className='text-xs font-medium text-muted-foreground'>
        Powered by Sorbet
      </span>
    </Link>
  </div>
);

// ============ Utilities ============

function getBeneficiaryName(details: Record<string, unknown>): string {
  if (details.accountType === 'business' && details.companyName) {
    return String(details.companyName);
  }
  return (
    [details.firstName, details.lastName].filter(Boolean).join(' ') ||
    String(details.accountName ?? '') ||
    'N/A'
  );
}

function getBeneficiaryAddress(details: Record<string, unknown>): string {
  const addr = details.beneficiaryAddress as Record<string, unknown> | undefined;
  if (!addr) return '';
  return [
    addr.street_line_1,
    addr.street_line_2,
    addr.city,
    addr.state,
    addr.postal_code,
    addr.country,
  ]
    .filter(Boolean)
    .join(', ');
}

function buildCopyText(
  details: Record<string, unknown>,
  currency: string,
  swiftDetails?: Record<string, unknown>
): string {
  const entries: [string, string | undefined][] = [];

  if (currency === 'USD') {
    entries.push(
      ['Currency', 'USD'],
      ['Account Number', String(details.accountNumber ?? '')],
      ['ACH Routing', String(details.routingNumberACH ?? details.routingNumber ?? '')],
      ['Wire Routing', String(details.routingNumberWire ?? details.routingNumber ?? '')],
      ['Account Type', 'Checking'],
      ['Beneficiary', getBeneficiaryName(details)],
      ['Bank', String(details.bankName ?? '')]
    );
    if (swiftDetails) {
      entries.push(
        ['SWIFT Account #', String(swiftDetails.swiftAccountNumber ?? '')],
        ['SWIFT Code', String(swiftDetails.swiftCode ?? '')]
      );
    }
  } else if (currency === 'EUR') {
    entries.push(
      ['Currency', 'EUR'],
      ['IBAN', String(details.IBAN ?? '')],
      ['SWIFT Code', details.swiftCode ? String(details.swiftCode) : undefined],
      ['Account Holder', getBeneficiaryName(details)],
      ['Bank', details.bankName ? String(details.bankName) : undefined]
    );
  } else if (currency === 'AED') {
    entries.push(
      ['Currency', 'AED'],
      ['IBAN', String(details.IBAN ?? '')],
      ['SWIFT Code', details.swiftCode ? String(details.swiftCode) : undefined],
      ['Account Holder', getBeneficiaryName(details)],
      ['Bank', details.bankName ? String(details.bankName) : undefined]
    );
  }

  return entries
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
}
