import QRCodeStyling, { Options } from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';

export const useGenerateQRCode = (url: string) => {
  const qrCodeRef = useRef<HTMLDivElement>(document.createElement('div'));
  const [isPngCopied, setIsPngCopied] = useState(false);
  const [isSvgCopied, setIsSvgCopied] = useState(false);
  const [isLoadingQRCode, setIsLoadingQRCode] = useState(true);

  const qrOptions: Options = {
    type: 'svg',
    width: 300,
    height: 300,
    margin: 0,
    data: url,
    qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' },
    imageOptions: { hideBackgroundDots: false, imageSize: 0.4, margin: 0 },
    dotsOptions: {
      type: 'square',
      color: '#6a1a4c',
      gradient: {
        type: 'radial',
        rotation: 0,
        colorStops: [
          { offset: 0, color: '#d3ec30' },
          { offset: 1, color: '#573df5' },
        ],
      },
    },
    backgroundOptions: { color: '#f9f7ff' },
    image: '/svg/logo.svg',
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#573df5',
      gradient: undefined,
    },
    cornersDotOptions: { type: 'square', color: '#d3ec30' },
  };
  const qrCodeStyling = new QRCodeStyling(qrOptions);

  useEffect(() => {
    if (qrCodeRef.current && qrCodeStyling) {
      qrCodeRef.current.innerHTML = '';
      qrCodeStyling.append(qrCodeRef.current);
      setIsLoadingQRCode(false);
    }
  }, [qrCodeStyling]);

  const downloadQRCode = (username: string, fileExt: 'svg' | 'png') => {
    qrCodeStyling.download({
      name: `${username}-sorbet-qrcode`,
      extension: fileExt,
    });
    if (fileExt === 'png') {
      setIsPngCopied(true);
    } else if (fileExt === 'svg') {
      setIsSvgCopied(true);
    }
  };

  return {
    qrCodeRef,
    isPngCopied,
    isSvgCopied,
    isLoadingQRCode,
    downloadQRCode,
  };
};
