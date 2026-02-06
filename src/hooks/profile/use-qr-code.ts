import { merge } from 'lodash';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [isLoadingQRCode, setIsLoadingQRCode] = useState(true);

  const optionsWithData: Options = {
    ...defaultOptions,
    data,
  };

  const qrOptions: Options = merge({}, optionsWithData, options);

  const qrCode = useMemo(() => new QRCodeStyling(qrOptions), [qrOptions]);

  useEffect(() => {
    // If the dialog/drawer content isn't mounted yet, we can't append.
    // Keep showing the Skeleton until a real DOM element is available.
    if (!containerEl) {
      setIsLoadingQRCode(true);
      return;
    }

    containerEl.innerHTML = '';
    qrCode.append(containerEl);
    setIsLoadingQRCode(false);

    // Best-effort cleanup to avoid leaving orphaned SVG nodes if the container unmounts.
    return () => {
      containerEl.innerHTML = '';
    };
  }, [containerEl, qrCode]);

  const qrCodeRef = useCallback((node: HTMLDivElement | null) => {
    setContainerEl(node);
  }, []);

  return {
    qrCodeRef,
    qrCode,
    isLoadingQRCode,
  };
};
