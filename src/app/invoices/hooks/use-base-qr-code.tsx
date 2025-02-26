import { Options } from 'qr-code-styling';

import { useGenerateQRCode } from '@/hooks/profile/useGenerateQRCode';

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
 * Generates a QR code for a Base network address
 * @param address - The address to generate the QR code for
 * @returns The QR code and a boolean indicating if it is loading
 */
export const useBaseQRCode = (address: string) => {
  const { qrCodeRef, isLoadingQRCode } = useGenerateQRCode(address, qrOptions);

  return { qrCodeRef, isLoadingQRCode };
};
