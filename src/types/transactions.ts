import { DrainState } from '@/types/bridge';

export interface Transaction {
  sender: string;
  receiver: string;
  value: string;
  timestamp: string;
  hash: string;
  status?: DrainState;
}

export interface TransactionOverview {
  money_in: Transaction[];
  money_out: Transaction[];
  transactions: Transaction[];
  total_money_in: string;
  total_money_out: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  cursor: string;
}


// Unified Transaction Types (new API)

export type UnifiedTransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'in_review'
  | 'refunded';

export type UnifiedTransactionType = 'onramp' | 'offramp' | 'crypto_transfer';

export type TransactionEndpoint = {
  type: 'wallet' | 'bank' | 'virtual_account';
  identifier: string;
  label?: string;
};

export interface UnifiedTransaction {
  id: string;
  type: UnifiedTransactionType;
  amount: string;
  currency: string;
  status: UnifiedTransactionStatus;
  date: string;
  source: TransactionEndpoint;
  destination: TransactionEndpoint;
  provider: 'bridge' | 'moralis';
  txHash?: string;
}

export interface UnifiedTransactionsResponse {
  transactions: UnifiedTransaction[];
  cursor?: string;
  summary?: {
    totalIn: string;
    totalOut: string;
    count: number;
  };
}
