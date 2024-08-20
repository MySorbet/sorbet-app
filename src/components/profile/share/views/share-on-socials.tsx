import { Download01 } from '@untitled-ui/icons-react';
import { QRCode } from 'react-qrcode-logo';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Body, Container, Header, ShareLink } from '../components';
import { ViewProps } from '../share-profile-dialog';

type ShareOnSocialsProps = ViewProps;

export const ShareOnSocials = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareOnSocialsProps) => {
  const { toast } = useToast();
  const url = `${window.location.origin}/${username}`;

  const handleDownloadPng = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${username}-sorbet-qrcode.png`;
    a.click();
    a.remove();
  };

  // TODO - Implement SVG download. Currently not working.
  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('qrcode') as SVGElement | null;

    if (!svgElement) {
      toast({
        title: 'Oops!',
        description: 'Failed to download SVG, please try again',
        variant: 'destructive',
      });
      return; // Exit if the SVG element doesn't exist
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });

    const a = document.createElement('a');
    const url = URL.createObjectURL(svgBlob);
    a.href = url;
    a.download = `${username}-sorbet-qrcode.svg`;
    a.click();

    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <Container>
      <Header
        title='Share on socials'
        description='Your unique Sorbet QR code that will direct people to your Sorbet profile when scanned'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <div className='flex w-full items-center justify-center'>
          <QRCode
            id='qrcode'
            value={url}
            size={250}
            // TODO - Correctly render the logo in the qr code
            logoImage='../../../../../public/images/logo.png'
            logoHeight={24}
            logoWidth={24}
          />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download PNG</span>
            <Button
              className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
              onClick={handleDownloadPng}
            >
              <Download01 className='h-6 w-6 text-black ease-out hover:scale-105' />
            </Button>
          </div>
          <div className='m-0 flex items-center justify-between '>
            <span className='text-base text-black'>Download SVG</span>
            <Button
              className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
              onClick={handleDownloadSvg}
            >
              <Download01 className='h-6 w-6 text-black ease-out hover:scale-105' />
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
