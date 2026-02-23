import type { User } from '@privy-io/react-auth';

const isStellarPublicKey = (address: unknown): address is string => {
  return typeof address === 'string' && /^G[A-Z2-7]{55}$/.test(address.trim());
};

type PrivyLinkedAccountLike = {
  type?: unknown;
  chainType?: unknown;
  chain_type?: unknown;
  chain?: unknown;
  address?: unknown;
};

const readLinkedAccounts = (privyUser: User | null): unknown => {
  const u = privyUser as unknown as {
    linkedAccounts?: unknown;
    linked_accounts?: unknown;
  } | null;
  return u?.linkedAccounts ?? u?.linked_accounts ?? [];
};

/**
 * Resolve the user's Stellar wallet public key (G...) from their Privy user object.
 * Mirrors the backend's defensive parsing.
 */
export const getStellarAddressFromPrivyUser = (
  privyUser: User | null
): string | null => {
  const linkedAccountsRaw = readLinkedAccounts(privyUser);
  if (!Array.isArray(linkedAccountsRaw)) return null;
  const linkedAccounts = linkedAccountsRaw as PrivyLinkedAccountLike[];

  const walletAccounts = linkedAccounts.filter((a) => {
    if (!a || typeof a !== 'object') return false;
    const t = String((a as PrivyLinkedAccountLike).type ?? '').toLowerCase();
    return t === 'wallet' || t.includes('wallet');
  });

  const byChain = walletAccounts.find((w) => {
    const chain = String(
      (w as PrivyLinkedAccountLike).chainType ??
        (w as PrivyLinkedAccountLike).chain_type ??
        (w as PrivyLinkedAccountLike).chain ??
        ''
    ).toLowerCase();
    return chain === 'stellar';
  });
  const byChainAddr = (byChain as PrivyLinkedAccountLike | undefined)?.address;
  if (isStellarPublicKey(byChainAddr)) return byChainAddr;

  const byHeuristic = walletAccounts.find((w) =>
    isStellarPublicKey((w as PrivyLinkedAccountLike | undefined)?.address)
  );
  const addr = (byHeuristic as PrivyLinkedAccountLike | undefined)?.address;
  return isStellarPublicKey(addr) ? addr : null;
};
