import { Plus , Send01, Share01} from "@untitled-ui/icons-react";

import { Button } from '@/components/ui/button';

import { Body, Container, Header, Option, ShareLink } from '../reusables';
import { ViewProps } from '../share-profile-dialog';

interface ShareYourProfileProps extends ViewProps {
  handleUrlToClipboard: () => void;
}

export const ShareYourProfile = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareYourProfileProps) => {
  return (
    <Container>
      <Header
        title='Share your profile'
        description='Showcase your skills globally - share your Sorbet profile on all your channels.'
      />
      <Body>
        <div className='flex flex-col gap-6'>
          <Option
            asset={<Plus className='h-8 w-8 font-light text-black' />}
            title='Add to my social'
            navigate={() => setActive('AddToSocials')}
          />
          <Option
            asset={<Send01 className='h-8 w-8 font-light text-black' />}
            title='Share my profile to...'
            navigate={() => setActive('ShareMyProfileTo')}
          />
          <Option
            asset={<Share01 className='h-8 w-8 font-light text-black' />}
            title='My Sorbet QR code'
            navigate={() => setActive('ShareOnSocials')}
          />
        </div>
        <Button
          className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
          onClick={handleUrlToClipboard}
        >
          <ShareLink
            username={username}
            handleUrlToClipboard={handleUrlToClipboard}
          />
        </Button>
      </Body>
    </Container>
  );
};
