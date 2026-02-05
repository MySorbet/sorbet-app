import type { User } from '@privy-io/react-auth';

const isStellarPublicKey = (address: unknown): address is string => {
  return typeof address === 'string' && /^G[A-Z2-7]{55}$/.test(address.trim());
};

/**
 * Resolve the user's Stellar wallet public key (G...) from their Privy user object.
 * Mirrors the backend's defensive parsing.
 */
export const getStellarAddressFromPrivyUser = (privyUser: User | null): string | null => {
  const linkedAccounts: any[] =
    (privyUser as any)?.linkedAccounts ?? (privyUser as any)?.linked_accounts ?? [];
  if (!Array.isArray(linkedAccounts)) return null;

  const walletAccounts = linkedAccounts.filter((a) => {
    if (!a || typeof a !== 'object') return false;
    const t = String((a as any).type ?? '').toLowerCase();
    return t === 'wallet' || t.includes('wallet');
  });

  const byChain = walletAccounts.find((w) => {
    const chain = String(
      (w as any).chainType ?? (w as any).chain_type ?? (w as any).chain ?? ''
    ).toLowerCase();
    return chain === 'stellar';
  });
  const byChainAddr = (byChain as any)?.address;
  if (isStellarPublicKey(byChainAddr)) return byChainAddr;

  const byHeuristic = walletAccounts.find((w) => isStellarPublicKey((w as any)?.address));
  const addr = (byHeuristic as any)?.address;
  return isStellarPublicKey(addr) ? addr : null;
};

