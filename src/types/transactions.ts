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
