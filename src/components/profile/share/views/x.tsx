import {
  Body,
  Container,
  Header,
  Option,
  QRCode,
  TwitterIcon,
} from '../reusables';
import { ViewProps } from '../share-profile-dialog';
import ShareTwitter from '@/../public/ShareTwitter.png';
import Image from 'next/image';

export const XTwitter = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ViewProps) => {
  return (
    <Container gap='6'>
      <Header
        title='X'
        description='Add Sorbet to your X profile. Simply copy your Sorbet URL, go to your profile, click on Edit Profile, and paste your Sorbet URL into the Website field.'
        canGoBack={true}
        navigateToPrevious={() => setActive('AddToSocials')}
      />
      <Body>
        <Image
          src={ShareTwitter}
          height={186}
          width={368}
          alt='Sorbet'
          className='w-auto rounded-3xl object-cover'
        />
        <QRCode
          username={username!}
          handleUrlToClipboard={handleUrlToClipboard!}
        />
        <a
          href='https://www.x.com/settings/profile'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Option
            asset={<TwitterIcon />}
            title='Go to my X'
            socialIcon={true}
          />
        </a>
      </Body>
    </Container>
  );
};
