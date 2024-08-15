import { Download } from 'lucide-react';
import { Body, Container, Header, Option, QRCode } from '../reusables';

import { ViewProps } from '../share-profile-dialog';
import { Button } from '@/components/ui/button';

export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ViewProps) => {
  return (
    <Container gap='6'>
      <Header
        title='Share on socials'
        description='Your unique Sorbet QR code that will direct people to your Sorbet profile when scanned'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <div className='h-[184px] w-[184px] bg-black' />
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <span className='text-base'>Download PNG</span>
            <Download className='h-6 w-6' />
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-base'>Download SVG</span>
            <Download className='h-6 w-6' />
          </div>
        </div>
      </Body>

      <QRCode
        username={username!}
        handleUrlToClipboard={handleUrlToClipboard!}
      />
    </Container>
  );
};
