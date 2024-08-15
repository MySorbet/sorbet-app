import { Button } from '@/components/ui/button';
import { Body, Container, Header, Option, QRCode } from '../reusables';
import { ViewProps } from '../share-profile-dialog';
import { Popover } from '@/components/ui/popover';

export const ShareMyProfile = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ViewProps) => {
  return (
    <Container gap='6'>
      <Header
        title='Share my profile'
        description='Get noticed by adding your Sorbet URL to your social channels'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <div className='flex flex-col gap-6'>
          <a href='https://www.x.com/intent/tweet' target='_blank' rel="noopener noreferrer">
            <Option asset={<div>T</div>} title='X' />
          </a>
          // TODO: figure out how we want to share to Instagram. Story? Post?
          <Option asset={<div>I</div>} title='Instagram' />
        </div>
        <QRCode
          username={username!}
          handleUrlToClipboard={handleUrlToClipboard!}
        />
      </Body>
    </Container>
  );
};
