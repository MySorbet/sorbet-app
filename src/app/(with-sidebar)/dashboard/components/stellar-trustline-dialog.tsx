'use client';

import { useSignRawHash } from '@privy-io/react-auth/extended-chains';
import {
  Asset,
  Horizon,
  Networks,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/env';
import { formatWalletAddress } from '@/lib/utils';

const bytesToHex = (bytes: ArrayLike<number>) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

const hexToBytes = (hex: string) => {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
};

const bytesToBase64 = (bytes: Uint8Array) => {
  // Avoid Buffer usage in the browser.
  let binary = '';
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

export const StellarTrustlineDialog = ({
  open,
  onOpenChange,
  stellarAddress,
  onTrustlineEstablished,
  establishTrustlineOverride,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stellarAddress: string;
  onTrustlineEstablished: () => void;
  /**
   * Optional override used for Storybook/testing. If provided, the dialog will
   * call this instead of signing/submitting a real Stellar transaction.
   */
  establishTrustlineOverride?: () => Promise<void>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signRawHash } = useSignRawHash();

  const horizonUrl = env.NEXT_PUBLIC_TESTNET
    ? env.NEXT_PUBLIC_STELLAR_HORIZON_URL_TESTNET
    : env.NEXT_PUBLIC_STELLAR_HORIZON_URL_PUBLIC;

  const networkPassphrase = env.NEXT_PUBLIC_TESTNET
    ? Networks.TESTNET
    : Networks.PUBLIC;

  const usdcAsset = useMemo(() => {
    return new Asset(
      env.NEXT_PUBLIC_STELLAR_USDC_ASSET_CODE,
      env.NEXT_PUBLIC_STELLAR_USDC_ISSUER
    );
  }, []);

  const handleEstablishTrustline = async () => {
    setIsSubmitting(true);
    try {
      if (establishTrustlineOverride) {
        await establishTrustlineOverride();
        toast.success('USDC trustline established');
        onOpenChange(false);
        onTrustlineEstablished();
        return;
      }

      const server = new Horizon.Server(horizonUrl);
      const account = await server.loadAccount(stellarAddress);

      // NOTE: We don't need a memo. We keep a short timeout.
      const tx = new TransactionBuilder(account, {
        fee: String(await server.fetchBaseFee()),
        networkPassphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset: usdcAsset,
          })
        )
        .setTimeout(180)
        .build();

      const hashHex = `0x${bytesToHex(tx.hash())}` as `0x${string}`;
      const { signature } = await signRawHash({
        address: stellarAddress,
        chainType: 'stellar',
        hash: hashHex,
      });

      // `addSignature` expects base64 signature string.
      const sigBytes = hexToBytes(signature.slice(2));
      const sigBase64 = bytesToBase64(sigBytes);
      tx.addSignature(stellarAddress, sigBase64);

      // Submit to Horizon
      await server.submitTransaction(tx);

      toast.success('USDC trustline established');
      onOpenChange(false);
      onTrustlineEstablished();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error('Failed to establish trustline', { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className='p-0 md:max-w-sm'>
        <div className='flex flex-col gap-4 p-6'>
          <div className='flex flex-col gap-1'>
            <CredenzaTitle className='text-xl font-semibold text-[#101828]'>
              Add USDC trustline
            </CredenzaTitle>
            <CredenzaDescription className='text-sm text-[#667085]'>
              To use Stellar on Sorbet, your Stellar wallet must establish a
              trustline for USDC.
            </CredenzaDescription>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm text-[#667085]'>Wallet</span>
            <CopyButton
              stringToCopy={stellarAddress}
              variant='ghost'
              className='h-auto gap-1 p-0 text-sm font-medium text-[#344054] hover:bg-transparent'
              copyIconClassName='size-4 text-[#98A2B3]'
            >
              {formatWalletAddress(stellarAddress)}
            </CopyButton>
          </div>

          <div className='rounded-lg border border-[#E4E4E7] bg-[#F9FAFB] p-3 text-sm text-[#344054]'>
            This will create a Stellar transaction from your wallet to add a
            trustline for{' '}
            <span className='font-semibold'>
              {env.NEXT_PUBLIC_STELLAR_USDC_ASSET_CODE}
            </span>
            .
          </div>

          <div className='flex gap-3'>
            <BackButton
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Close
            </BackButton>
            <Button
              className='flex-1'
              onClick={handleEstablishTrustline}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className='mr-2' /> Establishing…
                </>
              ) : (
                'Establish trustline'
              )}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};
