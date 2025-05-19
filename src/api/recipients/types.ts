import { BankRecipientFormValuesWithRequiredValues } from '@/app/(with-sidebar)/transfers/components/bank-recipient-form';
import { CryptoRecipientFormValues } from '@/app/(with-sidebar)/transfers/components/crypto-recipient-form';

export type RecipientType = 'usd' | 'eur' | 'crypto';

/** Data sent to the API to create a recipient */
export type CreateRecipientDto =
  | { type: 'usd'; values: BankRecipientFormValuesWithRequiredValues }
  | { type: 'eur'; values: BankRecipientFormValuesWithRequiredValues }
  | { type: 'crypto'; values: CryptoRecipientFormValues };

/** Recipients received from the API */
type RecipientAPIBase = {
  id: string;
  type: RecipientType;
  walletAddress: string;
  label: string;
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
