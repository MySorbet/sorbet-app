'use client';

import { CheckCircle, Download01 } from '@untitled-ui/icons-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGenerateQRCode } from '@/hooks/profile/useGenerateQRCode';

import { Body, Header, ShareLink } from '../components';
import { ViewProps } from '../share-profile-dialog';

type ShareOnSocialsProps = ViewProps;

/** Page rendered when a user want to share their Sorbet profile
 * and sent out a QR Code to it */
export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareOnSocialsProps) => {
  const url = `${window.location.origin}/${username}`;

  const { qrCodeRef, qrCode, isLoadingQRCode } = useGenerateQRCode(url);

  const [isPngCopied, setIsPngCopied] = useState(false);
  const [isSvgCopied, setIsSvgCopied] = useState(false);

  /** Downloads SVG or PNG of QR code to user's computer */
  const downloadQRCode = (username: string, fileExt: 'svg' | 'png') => {
    qrCode.download({
      name: `${username}-sorbet-qrcode`,
      extension: fileExt,
    });
    if (fileExt === 'png') {
      setIsPngCopied(true);
    } else if (fileExt === 'svg') {
      setIsSvgCopied(true);
    }
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
          {isLoadingQRCode ? (
            <Skeleton className='h-[256px] w-[256px]' />
          ) : (
            <div ref={qrCodeRef} />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download PNG</span>
            <Button
              className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
              onClick={() => downloadQRCode(username, 'png')}
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
              onClick={() => downloadQRCode(username, 'svg')}
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
