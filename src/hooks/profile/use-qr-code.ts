import { merge } from 'lodash';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { useEffect, useMemo, useRef, useState } from 'react';

const color = '#000000';
const size = 192; // w-48
const defaultOptions: Options = {
  type: 'svg',
  width: size,
  height: size,
  margin: 0,
  dotsOptions: {
    type: 'dots',
    color: color,
  },
  backgroundOptions: { color: 'transparent' },
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
  qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' },
};

/** Generates QR code as an SVG */
export const useQRCode = (data: string, options?: Options) => {
  const qrCodeRef = useRef<HTMLDivElement>(document.createElement('div'));
  const [isLoadingQRCode, setIsLoadingQRCode] = useState(true);

  const optionsWithData: Options = {
    ...defaultOptions,
    data,
  };

  const qrOptions: Options = merge({}, optionsWithData, options);

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
