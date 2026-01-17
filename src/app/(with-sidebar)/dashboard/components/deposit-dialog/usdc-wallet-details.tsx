'use client';

import { Info } from 'lucide-react';

import { useBaseQRCode } from '@/app/invoices/hooks/use-base-qr-code';
import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatWalletAddress } from '@/lib/utils';

interface USDCWalletDetailsProps {
    walletAddress: string;
    onBack: () => void;
    onClose: () => void;
}

/**
 * USDC Wallet details screen with QR code and wallet address
 */
export const USDCWalletDetails = ({
    walletAddress,
    onBack,
    onClose,
}: USDCWalletDetailsProps) => {
    const { qrCodeRef, isLoadingQRCode } = useBaseQRCode(walletAddress);

    return (
        <div className='flex flex-col gap-4 p-6'>
            {/* Header with title and address */}
            <div className='flex flex-col gap-1'>
                <h2 className='text-xl font-semibold text-[#101828]'>
                    USDC Wallet Details
                </h2>
                <div className='flex items-center justify-between'>
                    <span className='text-sm text-[#667085]'>Address</span>
                    <CopyButton
                        stringToCopy={walletAddress}
                        variant='ghost'
                        className='h-auto gap-1 p-0 text-sm font-medium text-[#344054] hover:bg-transparent'
                        copyIconClassName='size-4 text-[#98A2B3]'
                    >
                        {formatWalletAddress(walletAddress)}
                    </CopyButton>
                </div>
            </div>

            {/* QR Code container */}
            <div className='flex items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-6'>
                {isLoadingQRCode ? (
                    <Skeleton className='size-48' />
                ) : (
                    <div ref={qrCodeRef} />
                )}
            </div>

            {/* Info alert */}
            <div className='flex items-start gap-2 rounded-lg border border-[#E4E4E7] bg-[#F9FAFB] p-3'>
                <Info className='mt-0.5 size-4 shrink-0 text-[#3B82F6]' />
                <p className='text-sm text-[#344054]'>
                    This address can only receive USDC on the Base Network. Funds may be
                    lost if USDC is sent on another network.
                </p>
            </div>

            {/* Buttons */}
            <div className='flex gap-3'>
                <BackButton onClick={onBack}>Back</BackButton>
                <Button variant='outline' onClick={onClose} className='flex-1'>
                    Close
                </Button>
            </div>
        </div>
    );
};
