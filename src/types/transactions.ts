export interface Transaction {
  sender: string;
  receiver: string;
  value: string;
  timestamp: string;
  hash: string;
}

export interface Transactions {
  money_in: Transaction[];
  money_out: Transaction[];
  transactions: Transaction[];
  total_money_in: string;
  total_money_out: string;
}

export interface Balances {
  usdc: number;
  near: number;
  nearUsd: number;
}

export interface TransactionsResponse {
  transactions: Transactions;
  balances: Balances;
}
