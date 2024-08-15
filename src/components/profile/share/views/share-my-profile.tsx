import {
  Body,
  Container,
  Header,
  Option,
  QRCode,
  TwitterIcon,
  InstagramIcon,
} from '../reusables';
import { ViewProps } from '../share-profile-dialog';

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
          <a
            href='https://www.x.com/intent/tweet'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Option asset={<TwitterIcon />} title='X' socialIcon={true} />
          </a>
          {/* // TODO: figure out how we want to share to Instagram. Story? Post? */}
          <Option
            asset={<InstagramIcon />}
            title='Instagram'
            socialIcon={true}
          />
        </div>
        <QRCode
          username={username!}
          handleUrlToClipboard={handleUrlToClipboard!}
        />
      </Body>
    </Container>
  );
};
