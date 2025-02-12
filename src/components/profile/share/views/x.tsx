import ShareTwitter from '~/images/ShareTwitter.png';

import {
  Body,
  DemoImage,
  Header,
  Option,
  ShareLink,
  TwitterIcon,
} from '../components';
import { ViewProps } from '../share-profile-dialog';

type TwitterProps = ViewProps;

export const XTwitter = ({
  username,
  setActive,
  handleUrlToClipboard,
}: TwitterProps) => {
  return (
    <>
      <Header
        title='X'
        description='Add Sorbet to your X profile. Simply copy your Sorbet URL, go to your profile, click on Edit Profile, and paste your Sorbet URL into the Website field.'
        canGoBack={true}
        navigateToPrevious={() => setActive('AddToSocials')}
      />
      <Body className='pt-0'>
        <DemoImage src={ShareTwitter} alt='Share Sorbet to X' />
        <ShareLink
          username={username}
          handleUrlToClipboard={handleUrlToClipboard}
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
    </>
  );
};
