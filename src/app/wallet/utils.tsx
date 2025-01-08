export const formatWalletAddress = (account: string): string => {
  return `${account.slice(0, 5)}...${account.slice(-5)}`;
};

// TODO: Merge this with the one in @/lib/currency.ts?
export const formatCurrency = (currency: string): string => {
  return Number(currency).toLocaleString();
};

export const formatTransactionDate = (date: string): string => {
  return date.split(',')[0];
};
