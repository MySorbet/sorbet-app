import { Plus, Send, Share } from 'lucide-react';

import { Body, Container, Header, Option, QRCode } from '../reusables';



export const ShareYourProfile = () => {
  return (
    <Container gap='6'>
      <Header
        title='Share your profile'
        description='Showcase your skills globally - share your Sorbet profile on all your channels.'
      />
      <Body>
        <div className='flex flex-col gap-6'>
          <Option
            asset={<Plus className='h-8 w-8 font-light' />}
            title='Add to my socials'
          />
          <Option
            asset={<Send className='h-8 w-8 font-light' />}
            title='Share my profile to...'
          />
          <Option
            asset={<Share className='h-8 w-8 font-light' />}
            title='Share my profile link'
          />
        </div>
        <QRCode username='valvalrez' />
      </Body>
    </Container>
  );
};
