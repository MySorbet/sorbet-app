import { BankRecipientFormValues } from '@/app/(with-sidebar)/recipients/components/bank-recipient-form';
import { CryptoRecipientFormValues } from '@/app/(with-sidebar)/recipients/components/crypto-recipient-form';

export type RecipientType = 'usd' | 'eur' | 'crypto';

/** Data sent to the API to create a recipient */
export type CreateRecipientDto =
  | { type: 'usd'; values: BankRecipientFormValues }
  | { type: 'eur'; values: BankRecipientFormValues }
  | { type: 'crypto'; values: CryptoRecipientFormValues };

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
  type: 'usd' | 'eur';
  liquidationAddressId: string;
  externalAccountId: string;
};

type RecipientAPICrypto = RecipientAPIBase & {
  type: 'crypto';
};

export type RecipientAPI = RecipientAPIBank | RecipientAPICrypto;

/** When fetching the details For a specific recipient, we get back a liquidation address and an external account. */
export type RecipientAPIBankDetailed = RecipientAPIBank & {
  liquidationAddress: LiquidationAddress;
  externalAccount: ExternalAccount;
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
