import { Plus, Send01, Share01 } from '@untitled-ui/icons-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Body, Header, Option, ShareLink } from '../components';
import { ViewProps } from '../share-profile-dialog';

type ShareYourProfileProps = ViewProps;

export const ShareYourProfile = ({
  username,
  setActive,
  handleUrlToClipboard,
}: ShareYourProfileProps) => {
  return (
    <>
      <Header
        title='Share your profile'
        description='Showcase your skills globally - share your Sorbet profile on all your channels.'
      />
      <Body>
        <div className='flex flex-col gap-6'>
          <Option
            asset={<Plus className='size-7 text-black' />}
            title='Add to my social'
            navigate={() => setActive('AddToSocials')}
          />
          <Option
            asset={<Send01 className='size-7 text-black' />}
            title='Share my profile to...'
            navigate={() => setActive('ShareMyProfileTo')}
          />
          <Option
            asset={<Share01 className='size-7 text-black' />}
            title='My Sorbet QR code'
            navigate={() => setActive('ShareOnSocials')}
          />
        </div>
        <div
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'default' }),
            'm-0 border-none bg-transparent p-0 hover:bg-transparent'
          )}
        >
          <ShareLink
            username={username}
            handleUrlToClipboard={handleUrlToClipboard}
          />
        </div>
      </Body>
    </>
  );
};
