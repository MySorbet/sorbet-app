import ShareInstagram from '@/../public/images/ShareInstagram.png';

import {
  Body,
  DemoImage,
  Header,
  InstagramIcon,
  Option,
  ShareLink,
} from '../components';
import { ViewProps } from '../share-profile-dialog';

type InstagramProps = ViewProps;

export const Instagram = ({
  username,
  setActive,
  handleUrlToClipboard,
}: InstagramProps) => {
  return (
    <>
      <Header
        title='Instagram'
        description='Add Sorbet to your Instagram profile. Simply copy your Sorbet URL, go to your profile, click on Edit Profile, and paste your Sorbet URL into the Website field.'
        canGoBack={true}
        navigateToPrevious={() => setActive('AddToSocials')}
      />
      <Body className='pt-0'>
        <DemoImage src={ShareInstagram} alt='Share Sorbet to Instagram' />
        <ShareLink
          username={username}
          handleUrlToClipboard={handleUrlToClipboard}
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
    </>
  );
};
