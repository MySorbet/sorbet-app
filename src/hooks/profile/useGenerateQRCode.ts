import QRCodeStyling, { Options } from 'qr-code-styling';

export const useGenerateQRCode = (url: string) => {
  const qrOptions: Options = {
    width: 256,
    height: 256,
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
  return qrCodeStyling;
};
