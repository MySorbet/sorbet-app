'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Copy, KeyRound } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { getStellarAddressFromPrivyUser } from '@/lib/stellar/privy';

import { SettingsSection } from '../settings-section';

type WalletSectionProps = {
  /** Storybook/testing override for Base smart wallet address shown. */
  baseSmartWalletAddressOverride?: string | null;
  /** Storybook/testing override for Stellar public key shown. */
  stellarAddressOverride?: string | null;
  /** Storybook/testing override for auth gating export buttons. */
  isAuthenticatedOverride?: boolean;
  /** Storybook/testing override for Base export behavior. */
  exportBaseOverride?: () => Promise<void> | void;
  /** Storybook/testing override for Stellar export behavior. */
  exportStellarOverride?: () => Promise<void> | void;
};

export const WalletSection = ({
  baseSmartWalletAddressOverride,
  stellarAddressOverride,
  isAuthenticatedOverride,
  exportBaseOverride,
  exportStellarOverride,
}: WalletSectionProps) => {
  const { ready, authenticated, user: privyUser, exportWallet } = usePrivy();
  const { smartWalletAddress } = useSmartWalletAddress();
  const computedStellarAddress = getStellarAddressFromPrivyUser(privyUser ?? null);

  const baseSmartWalletAddress = baseSmartWalletAddressOverride ?? smartWalletAddress;
  const stellarAddress = stellarAddressOverride ?? computedStellarAddress;

  const isAuthenticated = isAuthenticatedOverride ?? (ready && authenticated);

  const ethereumEmbeddedWalletAddress = useMemo(() => {
    const linkedAccounts: any[] =
      (privyUser as any)?.linkedAccounts ?? (privyUser as any)?.linked_accounts ?? [];
    if (!Array.isArray(linkedAccounts)) return null;

    const eth = linkedAccounts.find((a) => {
      if (!a || typeof a !== 'object') return false;
      return (
        (a as any).type === 'wallet' &&
        String((a as any).walletClientType ?? '').toLowerCase() === 'privy' &&
        String((a as any).chainType ?? (a as any).chain_type ?? '').toLowerCase() === 'ethereum'
      );
    });
    const addr = (eth as any)?.address;
    return typeof addr === 'string' ? addr : null;
  }, [privyUser]);

  const handleCopy = async (text: string | null) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Wallet address copied to clipboard');
    } catch {
      toast.error('Unable to copy. Please try again.');
    }
  };

  return (
    <SettingsSection
      label="Wallet"
      description="Wallet settings linked to this account"
    >
      <div className="flex flex-col gap-3">
        {/* Base export */}
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={async () => {
            if (exportBaseOverride) {
              await exportBaseOverride();
              return;
            }
            try {
              if (ethereumEmbeddedWalletAddress) {
                await exportWallet({ address: ethereumEmbeddedWalletAddress });
              } else {
                await exportWallet();
              }
            } catch (e: any) {
              toast.error('Unable to export wallet', {
                description: e?.message ?? String(e),
              });
            }
          }}
          disabled={!isAuthenticated}
          className="h-9 w-[178px] gap-2 rounded-md px-3 shadow-sm"
        >
          <KeyRound className="size-4" />
          Export Base key
        </Button>

        {/* Base wallet address pill */}
        <div className="flex items-center gap-2 rounded-full bg-muted/70 px-3 py-2">
          <p className="font-mono text-sm tabular-nums truncate">
            {baseSmartWalletAddress ?? 'Loading…'}
          </p>
          {baseSmartWalletAddress && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => handleCopy(baseSmartWalletAddress)}
              aria-label="Copy Base wallet address"
              className="h-6 w-6"
            >
              <Copy className="size-4" />
            </Button>
          )}
        </div>

        {/* Base notice */}
        <div
          role="alert"
          aria-live="polite"
          className="flex w-full max-w-md items-start gap-3 rounded-lg border bg-muted p-4"
        >
          <div className="flex-shrink-0 pt-0.5">
            <Image
              src="/svg/base-in-product.svg"
              width={24}
              height={24}
              alt="Base Network"
              className="size-6"
            />
          </div>
          <p className="flex-1 text-left text-sm leading-relaxed text-foreground">
            This address can only receive USDC on the Base Network. Funds may be
            lost if USDC is sent on another network.
          </p>
        </div>

        <div className="h-px w-full max-w-md bg-border" />

        {/* Stellar export */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-fit">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={async () => {
                  // Export disabled intentionally.
                  if (!stellarAddress) return;
                  if (exportStellarOverride) {
                    await exportStellarOverride();
                  } else {
                    try {
                      await exportWallet({ address: stellarAddress });
                    } catch (e: any) {
                      toast.error('Unable to export wallet', {
                        description: e?.message ?? String(e),
                      });
                    }
                  }
                }}
                disabled={true}
                className="h-9 w-[178px] gap-2 rounded-md px-3 shadow-sm opacity-60"
              >
                <KeyRound className="size-4" />
                Export Stellar key
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Stellar wallet can’t be exported.</TooltipContent>
        </Tooltip>

        {/* Stellar wallet address pill */}
        <div className="flex items-center gap-2 rounded-full bg-muted/70 px-3 py-2">
          <p className="font-mono text-sm tabular-nums truncate">
            {stellarAddress ?? 'Not active'}
          </p>
          {stellarAddress && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => handleCopy(stellarAddress)}
              aria-label="Copy Stellar wallet address"
              className="h-6 w-6"
            >
              <Copy className="size-4" />
            </Button>
          )}
        </div>
        {!stellarAddress && (
          <p className="text-xs text-muted-foreground">
            Hint: log out and log back in to activate your Stellar wallet.
          </p>
        )}

        {/* Stellar notice / hint */}
        <div
          role="alert"
          aria-live="polite"
          className="flex w-full max-w-md items-start gap-3 rounded-lg border bg-muted p-4"
        >
          <div className="flex-shrink-0 pt-0.5">
            <Image
              src="/svg/stellar_logo.svg"
              width={24}
              height={24}
              alt="Stellar Network"
              className="size-6"
            />
          </div>
          <p className="flex-1 text-left text-sm leading-relaxed text-foreground">
            {stellarAddress
              ? 'This address can only receive USDC on the Stellar Network. Funds may be lost if USDC is sent on another network.'
              : 'Your Stellar wallet is not active yet. Log out and log back in, then return here to export your Stellar key.'}
          </p>
        </div>
      </div>
    </SettingsSection>
  );
};
