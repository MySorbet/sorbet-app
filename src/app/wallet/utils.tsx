export const formatWalletAddress = (account: string) => {
  return `${account.slice(0, 5)}...${account.slice(-5)}`;
};
