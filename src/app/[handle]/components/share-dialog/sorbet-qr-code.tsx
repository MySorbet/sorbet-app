import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useSorbetQRCode } from '../../hooks/use-sorbet-qr-code';

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
      <div className='relative size-48'>
        <motion.div
          ref={qrCodeRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoadingQRCode ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        {isLoadingQRCode && <Skeleton className='absolute inset-0 size-48' />}
      </div>
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
