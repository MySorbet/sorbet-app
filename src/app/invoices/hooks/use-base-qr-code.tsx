import { Options } from 'qr-code-styling';

import { useQRCode } from '@/hooks/profile/use-qr-code';

const qrOptions: Options = {
  image: '/svg/base.svg',
};

/**
 * Generates a QR code for a Base network address
 * @param address - The address to generate the QR code for
 * @returns The QR code and a boolean indicating if it is loading
 */
export const useBaseQRCode = (address: string) => {
  const { qrCodeRef, isLoadingQRCode } = useQRCode(address, qrOptions);

  return { qrCodeRef, isLoadingQRCode };
};
