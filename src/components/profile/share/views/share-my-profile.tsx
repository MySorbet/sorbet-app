import { Body, Header, Option, ShareLink, TwitterIcon } from '../components';
import { ViewProps } from '../share-profile-dialog';

type ShareMyProfileToProps = ViewProps;

export const ShareMyProfileTo = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareMyProfileToProps) => {
  const url = `${window.location.origin}/${username}`;

  return (
    <>
      <Header
        title='Share my profile'
        description='Get noticed by adding your Sorbet URL to your social channels'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <div className='flex flex-col gap-6'>
          <a
            href={`https://www.x.com/intent/tweet?text=I%20just%20created%20my%20Sorbet%20profile%20🍧!%20Check%20it%20out%20here:&url=${url}/`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Option asset={<TwitterIcon />} title='X' socialIcon={true} />
          </a>
        </div>
        <ShareLink
          username={username}
          handleUrlToClipboard={handleUrlToClipboard}
        />
      </Body>
    </>
  );
};
