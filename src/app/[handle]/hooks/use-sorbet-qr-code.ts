import { Options } from 'qr-code-styling';

import { useQRCode } from '@/hooks/profile/use-qr-code';

const qrOptions: Options = {
  image: '/svg/bw-sorbet-logo.svg',
};

/** Customize the base QR code to use the Sorbet logo and provide a download function */
export const useSorbetQRCode = (url: string) => {
  const { qrCode, ...rest } = useQRCode(url, qrOptions);

  const downloadQRCode = (fileName?: string) => {
    qrCode.download({
      name: fileName ?? `sorbet-qr-code`,
      extension: 'svg',
    });
  };

  return { qrCode, ...rest, downloadQRCode };
};
