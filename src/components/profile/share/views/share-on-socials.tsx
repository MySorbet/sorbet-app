'use client';

import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useGenerateQRCode } from '@/hooks/profile/useGenerateQRCode';
import { CheckCircle, Download01 } from '@untitled-ui/icons-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Body, Header, ShareLink } from '../components';
import { ViewProps } from '../share-profile-dialog';

type ShareOnSocialsProps = ViewProps;

export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareOnSocialsProps) => {
  const url = `${window.location.origin}/${username}`;
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isPngCopied, setIsPngCopied] = useState(false);
  const [isSvgCopied, setIsSvgCopied] = useState(false);
  const [isQRCodeLoaded, setIsQRCodeLoaded] = useState(false);

  const { qrCode, downloadQRCode } = useMemo(
    () => useGenerateQRCode(url),
    [username]
  );

  useEffect(() => {
    console.log('is loaded', qrCode, qrCodeRef);
    if (qrCodeRef.current && qrCode) {
      qrCodeRef.current.innerHTML = '';
      qrCode.append(qrCodeRef.current);
      setIsQRCodeLoaded(true);
    }
  }, [qrCode]);

  const handleDownload = (fileExt: 'svg' | 'png') => {
    if (!qrCode) return;
    qrCode.download({
      name: `${username}-sorbet-qrcode`,
      extension: fileExt,
    });
  };

  return (
    <>
      <Header
        title='Share on socials'
        description='Your unique Sorbet QR code that will direct people to your Sorbet profile when scanned'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <div className='flex min-h-[256px] w-full items-center justify-center'>
          <div ref={qrCodeRef} className='qr-code-container h-64 w-64' />
          {!isQRCodeLoaded && <Spinner />}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download PNG</span>
            <Button
              className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
              onClick={() => {
                setIsPngCopied(true);
                downloadQRCode(username, 'png');
              }}
              disabled={isPngCopied}
            >
              {isPngCopied ? (
                <CheckCircle className='h-6 w-6 text-green-500' />
              ) : (
                <Download01 className='h-6 w-6 text-black ease-out hover:scale-105' />
              )}
            </Button>
          </div>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download SVG</span>
            <Button
              className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
              onClick={() => {
                setIsSvgCopied(true);
                downloadQRCode(username, 'svg');
              }}
              disabled={isSvgCopied}
            >
              {isSvgCopied ? (
                <CheckCircle className='h-6 w-6 text-green-500' />
              ) : (
                <Download01 className='h-6 w-6 text-black ease-out hover:scale-105' />
              )}
            </Button>
          </div>
        </div>
      </Body>

      <ShareLink
        username={username}
        handleUrlToClipboard={handleUrlToClipboard}
      />
    </>
  );
};
