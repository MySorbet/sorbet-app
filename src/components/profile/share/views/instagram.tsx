import {
  Body,
  Container,
  Header,
  InstagramIcon,
  Option,
  QRCode,
  DemoImage,
} from '../reusables';
import { ViewProps } from '../share-profile-dialog';
import Image from 'next/image';
import ShareInstagram from '@/../public/ShareInstagram.png';

export const Instagram = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ViewProps) => {
  return (
    <Container gap='6'>
      <Header
        title='Instagram'
        description='Add Sorbet to your Instagram profile. Simply copy your Sorbet URL, go to your profile, click on Edit Profile, and paste your Sorbet URL into the Website field.'
        canGoBack={true}
        navigateToPrevious={() => setActive('AddToSocials')}
      />
      <Body>
        <DemoImage src={ShareInstagram} alt='Share Sorbet to Instagram' />
        <QRCode
          username={username!}
          handleUrlToClipboard={handleUrlToClipboard!}
        />
        <a
          href='https://www.instagram.com/accounts/edit/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Option
            asset={<InstagramIcon />}
            title='Go to my instagram'
            socialIcon={true}
          />
        </a>
      </Body>
    </Container>
  );
};
