import { Body, Container, Header, Option, QRCode } from '../reusables';
import { ViewProps } from '../share-profile-dialog';

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
        <div className='h-[186px] w-full bg-black' />
        <QRCode
          username={username!}
          handleUrlToClipboard={handleUrlToClipboard!}
        />
        <a href='https://www.instagram.com/accounts/edit/' target="_blank" rel='noopener noreferrer'>
          <Option asset={<div>I</div>} title='Go to my instagram' />
        </a>
      </Body>
    </Container>
  );
};
