import { Options } from 'qr-code-styling';

import { CopyButton } from '@/app/invoices/components/dashboard/copy-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGenerateQRCode } from '@/hooks/profile/useGenerateQRCode';

// QR Code styles for the wallet address QR Code below
const color = '#000000';
const size = 192; // w-48
const qrOptions: Options = {
  width: size,
  height: size,
  margin: 0,
  dotsOptions: {
    type: 'dots',
    color: color,
  },
  backgroundOptions: { color: 'transparent' },
  image: '/svg/base.svg',
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 8,
  },
  cornersSquareOptions: {
    type: 'dot',
    color: color,
  },
  cornersDotOptions: {
    type: 'dot',
    color: color,
  },
};

/**
 * Displays a QR code and a USDC address for clients to pay the invoice
 */
export const InvoicePayUsdc = ({
  address,
  isLoading,
}: {
  address: string;
  isLoading?: boolean;
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  const { qrCodeRef, isLoadingQRCode } = useGenerateQRCode(address, qrOptions);

  return (
    <div className='flex w-[31rem] flex-col items-center justify-center rounded-xl bg-white p-4'>
      <div className='flex max-w-[42ch] flex-col items-center justify-center gap-2 text-center'>
        {isLoadingQRCode || isLoading ? (
          <Skeleton className='size-48' />
        ) : (
          <div ref={qrCodeRef} />
        )}
        {isLoading ? (
          <Skeleton className='h-5 w-[42ch]' />
        ) : (
          <div className='text-sm font-medium'>{address}</div>
        )}

        <CopyButton onCopy={handleCopy} disabled={isLoading}>
          Copy address
        </CopyButton>

        <span className='text-muted-foreground text-sm'>
          This address can only receive USDC on the{' '}
          <strong className='text-muted-foreground'>Base network</strong>. Funds
          may be lost if USDC is sent on another network.
        </span>
      </div>
    </div>
  );
};
