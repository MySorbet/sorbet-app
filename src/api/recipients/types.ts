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
