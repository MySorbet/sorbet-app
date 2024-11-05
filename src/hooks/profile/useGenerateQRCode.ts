import { merge } from 'lodash';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { useEffect, useMemo, useRef, useState } from 'react';

/** Generates QR code as an SVG */
export const useGenerateQRCode = (data: string, options?: Options) => {
  const qrCodeRef = useRef<HTMLDivElement>(document.createElement('div'));
  const [isLoadingQRCode, setIsLoadingQRCode] = useState(true);

  const defaultOptions: Options = {
    type: 'svg',
    width: 300,
    height: 300,
    margin: 0,
    data,
    qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' },
  };

  const qrOptions: Options = merge({}, defaultOptions, options);

  const qrCode = useMemo(() => new QRCodeStyling(qrOptions), [qrOptions]);

  useEffect(() => {
    if (qrCodeRef.current && qrCode) {
      qrCodeRef.current.innerHTML = '';
      qrCode.append(qrCodeRef.current);
      setIsLoadingQRCode(false);
    }
  }, [qrCode]);

  return {
    qrCodeRef,
    qrCode,
    isLoadingQRCode,
  };
};
