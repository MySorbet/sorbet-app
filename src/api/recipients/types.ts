import { BankRecipientFormValues } from '@/app/(with-sidebar)/recipients/components/bank-recipient-form';
import { CryptoRecipientFormValues } from '@/app/(with-sidebar)/recipients/components/crypto-recipient-form';

// New Due Network payment method types
export type DuePaymentMethod =
  | 'usd_ach'
  | 'usd_wire'
  | 'usd_swift'
  | 'eur_sepa'
  | 'eur_swift'
  | 'aed_local';

// Legacy Bridge types (for backward compatibility)
export type LegacyRecipientType = 'usd' | 'eur';

// All recipient types
export type RecipientType = DuePaymentMethod | LegacyRecipientType | 'crypto';

// Due schema mapping
export type DueSchema = 'bank_us' | 'bank_sepa' | 'bank_swift' | 'bank_mena';

// Payment method option for UI selection
export interface PaymentMethodOption {
  id: DuePaymentMethod;
  label: string;
  currency: string;
  rail: string;
  schema: DueSchema;
  // Country code for CircleFlag (ISO 3166-1 alpha-2)
  flagCountryCode: string;
}

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    id: 'usd_ach',
    label: 'USD (ACH)',
    currency: 'USD',
    rail: 'ach',
    flagCountryCode: 'us',
    schema: 'bank_us',
  },
  {
    id: 'usd_wire',
    label: 'USD (WIRE)',
    currency: 'USD',
    rail: 'wire',
    flagCountryCode: 'us',
    schema: 'bank_us',
  },
  {
    id: 'usd_swift',
    label: 'USD (SWIFT)',
    currency: 'USD',
    rail: 'swift',
    flagCountryCode: 'us',
    schema: 'bank_swift',
  },
  {
    id: 'eur_sepa',
    label: 'EUR (SEPA)',
    currency: 'EUR',
    rail: 'sepa',
    flagCountryCode: 'eu',
    schema: 'bank_sepa',
  },
  {
    id: 'eur_swift',
    label: 'EUR (SWIFT)',
    currency: 'EUR',
    rail: 'swift',
    flagCountryCode: 'eu',
    schema: 'bank_swift',
  },
  {
    id: 'aed_local',
    label: 'AED (Local Transfer)',
    currency: 'AED',
    rail: 'local',
    flagCountryCode: 'ae',
    schema: 'bank_mena',
  },
];

/** Data sent to the API to create a recipient */
export type CreateRecipientDto =
  | { type: DuePaymentMethod; values: BankRecipientFormValues }
  | { type: 'crypto'; values: CryptoRecipientFormValues }
  // Legacy types for backward compatibility
  | { type: 'usd'; values: BankRecipientFormValues }
  | { type: 'eur'; values: BankRecipientFormValues };

/** Data sent to the API to migrate a Bridge recipient to Due Network */
export interface MigrateRecipientDto {
  paymentMethod: 'usd_ach' | 'eur_sepa' | 'aed_local';
  accountNumber?: string; // Required for USD
  routingNumber?: string; // Required for USD if Bridge data unavailable
  iban?: string; // Required for EUR/AED
  beneficiaryAddress?: {
    street_line_1: string;
    street_line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  minimalAddress?: {
    street_line_1: string;
  };
}

/** Recipients received from the API */
type RecipientAPIBase = {
  id: string;
  type: RecipientType;
  walletAddress: string;
  label: string;
  /**
   * For bank recipients, this is the last 4 digits of the account number
   * For crypto recipients, this is the wallet address
   */
  detail: string;

  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type RecipientAPIBank = RecipientAPIBase & {
  type: DuePaymentMethod | 'usd' | 'eur';
  // Bridge-specific (legacy)
  liquidationAddressId?: string;
  externalAccountId?: string;
  // Due-specific (new)
  dueRecipientId?: string;
  dueSchema?: DueSchema;
  provider?: 'bridge' | 'due';
};

type RecipientAPICrypto = RecipientAPIBase & {
  type: 'crypto';
};

export type RecipientAPI = RecipientAPIBank | RecipientAPICrypto;

/** Due recipient details returned from Due Network API */
export type DueRecipientDetails = {
  id: string;
  name: string;
  email?: string;
  country?: string;
  details: {
    schema: DueSchema;
    accountType?: 'individual' | 'business';
    firstName?: string;
    lastName?: string;
    companyName?: string;
    // US bank fields
    accountNumber?: string;
    routingNumber?: string;
    // SWIFT fields
    swiftCode?: string;
    swiftAccountNumber?: string;
    currency?: string;
    // IBAN fields (SEPA, MENA)
    IBAN?: string;
    // Address
    beneficiaryAddress?: {
      street_line_1?: string;
      street_line_2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    [key: string]: unknown;
  };
  isExternal: boolean;
  createdAt: string;
  updatedAt: string;
};

/** When fetching the details for a specific recipient, we get back provider-specific details */
export type RecipientAPIBankDetailed = RecipientAPIBank & {
  // Bridge-specific (legacy)
  liquidationAddress?: LiquidationAddress;
  externalAccount?: ExternalAccount;
  // Due Network-specific (new)
  dueRecipient?: DueRecipientDetails;
};

/** A liquidation address record received from bridge. Type could be not completely correct. */
type LiquidationAddress = {
  id: string;
  created_at: string;
  updated_at: string;
  chain:
    | 'arbitrum'
    | 'avalanche_c_chain'
    | 'base'
    | 'ethereum'
    | 'optimism'
    | 'polygon'
    | 'solana'
    | 'stellar'
    | 'tron';
  address: string;
  currency: 'usdb' | 'usdc' | 'usdt' | 'dai' | 'pyusd' | 'eurc' | 'eur';
  external_account_id: string;
  customer_id: string;
  destination_payment_rail:
    | 'ach'
    | 'wire'
    | 'ach_push'
    | 'ach_same_day'
    | 'arbitrum'
    | 'avalanche_c_chain'
    | 'base'
    | 'ethereum'
    | 'fiat_deposit_return'
    | 'optimism'
    | 'polygon'
    | 'sepa'
    | 'solana'
    | 'spei'
    | 'stellar'
    | 'swift'
    | 'tron';
  destination_currency:
    | 'dai'
    | 'eur'
    | 'eurc'
    | 'mxn'
    | 'pyusd'
    | 'usd'
    | 'usdb'
    | 'usdc'
    | 'usdt';
  return_address: string;
  state: 'active' | 'deactivated';

  [key: string]: unknown; // Incase there is anything else
};

/** An external account record received from bridge. Type could be not completely correct. */
type ExternalAccount = {
  id: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
  bank_name: string;
  account_name: string | null; // seems not to be used
  account_owner_name: string;
  active: boolean;
  currency: 'usd' | 'eur' | 'mxn';
  account_owner_type: string;
  account_type: 'us' | 'iban' | 'clabe' | 'unknown';
  first_name: string;
  last_name: string;
  business_name: string | null;
  account?: {
    last_4: string;
    routing_number: string;
    checking_or_savings: 'checking' | 'savings';
  };
  iban?: {
    last_4: string;
    bic: string;
    country: string;
  };
  beneficiary_address_valid: boolean;
  last4: string; // deprecated

  [key: string]: unknown; // Incase there is anything else
};

/** Transfer history for a recipient */
export type RecipientTransferStatus =
  | 'completed'
  | 'processing'
  | 'in_review'
  | 'failed'
  | 'refunded';

export type RecipientTransferType = 'offramp' | 'onramp' | 'crypto_transfer';

export type RecipientTransfer = {
  id: string;
  date: string;
  amount: string;
  currency: string;
  status: RecipientTransferStatus;
  txHash?: string;
  type: RecipientTransferType;
};
