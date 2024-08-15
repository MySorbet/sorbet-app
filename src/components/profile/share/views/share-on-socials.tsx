import { Download } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useGenerateQRCode } from '@/hooks';

import { Body, Container, Header, ShareLink } from '../reusables';
import { ViewProps } from '../share-profile-dialog';

export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ViewProps) => {
  const url = `${window.location.origin}/${username}`;
  const { data: fetchedQRCode, isPending: isQRCodePending } =
    useGenerateQRCode(url);

  return (
    <Container gap='6'>
      <Header
        title='Share on socials'
        description='Your unique Sorbet QR code that will direct people to your Sorbet profile when scanned'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <div className='flex w-full items-center justify-center'>
          {isQRCodePending && <div>Loading...</div>}
          {fetchedQRCode && (
            <Image
              src={URL.createObjectURL(fetchedQRCode)}
              alt={`${username}'s Sorbet QR code`}
              height={250}
              width={250}
            />
          )}
        </div>
        <div className='flex flex-col gap-4'>
          <Button className='m-0 flex items-center justify-between border-none bg-transparent p-0 hover:bg-transparent'>
            <span className='text-base'>Download PNG</span>
            <Download className='h-6 w-6' />
          </Button>
          <Button className='m-0 flex items-center justify-between border-none bg-transparent p-0 hover:bg-transparent'>
            <span className='text-base'>Download SVG</span>
            <Download className='h-6 w-6' />
          </Button>
        </div>
      </Body>

      <ShareLink
        username={username!}
        handleUrlToClipboard={handleUrlToClipboard!}
      />
    </Container>
  );
};
