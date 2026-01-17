'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Copy, KeyRound } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

import { SettingsSection } from '../settings-section';

export const WalletSection = () => {
  const { exportWallet } = usePrivy();
  const { smartWalletAddress } = useSmartWalletAddress();

  const handleCopy = async () => {
    if (!smartWalletAddress) return;
    try {
      await navigator.clipboard.writeText(smartWalletAddress);
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
        {/* Export private key */}
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={exportWallet}
          className="h-9 w-[178px] gap-2 rounded-md px-3 shadow-sm"
        >
          <KeyRound className="size-4" />
          Export private key
        </Button>

        {/* Wallet address pill */}
        <div className="flex items-center gap-2 rounded-full bg-muted/70 px-3 py-2">
          <p className="font-mono text-sm tabular-nums truncate">
            {smartWalletAddress ?? 'Loading…'}
          </p>
          {smartWalletAddress && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleCopy}
              aria-label="Copy wallet address"
              className="h-6 w-6"
            >
              <Copy className="size-4" />
            </Button>
          )}
        </div>

        {/* Network notice */}
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
      </div>
    </SettingsSection>
  );
};
