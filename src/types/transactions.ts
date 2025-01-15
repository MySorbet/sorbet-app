export interface Transaction {
  sender: string;
  receiver: string;
  value: string;
  timestamp: string;
  hash: string;
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
