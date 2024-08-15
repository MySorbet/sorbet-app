import { Plus, Send, Share } from 'lucide-react';

import { Body, Container, Header, Option, QRCode } from '../reusables';
import { ViewProps } from '../share-profile-dialog';
import { Button } from '@/components/ui/button';

export const ShareYourProfile = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ViewProps) => {
  return (
    <Container gap='6'>
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
            asset={<Send className='h-8 w-8 font-light text-black' />}
            title='Share my profile to...'
            navigate={() => setActive('ShareMyProfileTo')}
          />
          <Option
            asset={<Share className='h-8 w-8 font-light text-black' />}
            title='Share my profile link'
            navigate={() => setActive('ShareOnSocials')}
          />
        </div>
        <Button
          className='m-0 border-none bg-transparent p-0 hover:bg-transparent'
          onClick={handleUrlToClipboard}
        >
          <QRCode username={username!} />
        </Button>
      </Body>
    </Container>
  );
};
