import { Download } from 'lucide-react';
import { QRCode } from 'react-qrcode-logo';

import { Button } from '@/components/ui/button';

import SorbetLogo from '../../../../../public/images/logo.png';
import { Body, Container, Header, ShareLink } from '../reusables';
import { ViewProps } from '../share-profile-dialog';

interface ShareOnSocialsProps extends ViewProps {
  handleUrlToClipboard: () => void;
}

export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareOnSocialsProps) => {
  const url = `${window.location.origin}/${username}`;

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
          <QRCode
            value={url}
            size={250}
            logoImage='../../../../../public/images/logo.png'
            logoHeight={24}
            logoWidth={24}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download PNG</span>
            <Button className='m-0 border-none bg-transparent p-0 hover:bg-transparent'>
              <Download className='h-6 w-6 text-black ease-out hover:scale-105' />
            </Button>
          </div>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download SVG</span>
            <Button className='m-0 border-none bg-transparent p-0 hover:bg-transparent'>
              <Download className='h-6 w-6 text-black ease-out hover:scale-105' />
            </Button>
          </div>
        </div>
      </Body>

      <ShareLink
        username={username}
        handleUrlToClipboard={handleUrlToClipboard}
      />
    </Container>
  );
};
