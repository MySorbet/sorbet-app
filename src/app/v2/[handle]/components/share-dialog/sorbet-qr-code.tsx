import { Download } from 'lucide-react';

import { useSorbetQRCode } from '@/app/v2/[handle]/hooks/use-sorbet-qr-code';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/** A card that displays a QR code and a download button */
export const SorbetQRCode = ({
  url,
  handle,
}: {
  /** The URL of the QR code */
  url: string;
  /** The handle of the user (used for the filename of the downloaded QR code) */
  handle: string;
}) => {
  const { qrCodeRef, isLoadingQRCode, downloadQRCode } = useSorbetQRCode(url);

  return (
    <div className='flex w-full flex-col items-center justify-center gap-2 rounded-md border p-3'>
      {isLoadingQRCode ? (
        <Skeleton className='size-48' />
      ) : (
        <div ref={qrCodeRef} />
      )}
      <Button
        variant='secondary'
        onClick={() => downloadQRCode(`${handle}-sorbet-qr-code`)}
        disabled={isLoadingQRCode}
      >
        <Download /> Download QR code
      </Button>
    </div>
  );
};
