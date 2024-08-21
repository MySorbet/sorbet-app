'use client';

import { CheckCircle,Download01 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useState } from 'react';

import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';
import { useGenerateQRCode } from '@/hooks/profile/useGenerateQRCode';

import { Body, Header, ShareLink } from '../components';
import { ViewProps } from '../share-profile-dialog';

type ShareOnSocialsProps = ViewProps;

export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareOnSocialsProps) => {
  const url = `${window.location.origin}/${username}`;

  const [isPngCopied, setIsPngCopied] = useState(false);
  const [isSvgCopied, setIsSvgCopied] = useState(false);

  const {
    svgURL,
    pngURL,
    isPending: isQRCodeUrlsPending,
  } = useGenerateQRCode(url);

  const handleDownloadPng = () => {
    if (!pngURL) {
      return;
    }

    const a = document.createElement('a');
    a.href = pngURL;
    a.download = `${username}-sorbet-qrcode.png`;
    a.click();
    a.remove();
    URL.revokeObjectURL(pngURL);
  };

  const handleDownloadSvg = () => {
    if (!svgURL) {
      return;
    }

    const a = document.createElement('a');
    a.href = svgURL;
    a.download = `${username}-sorbet-qrcode.svg`;
    a.click();
    a.remove();
    URL.revokeObjectURL(svgURL);
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
          {isQRCodeUrlsPending ? (
            <Spinner />
          ) : (
            pngURL && (
              <Image
                src={pngURL}
                alt='QR Code'
                id='qrcode'
                width={256}
                height={256}
              />
            )
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download PNG</span>
            <Button
              className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
              onClick={() => {
                setIsPngCopied(true);
                handleDownloadPng();
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
                handleDownloadSvg();
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
