import { Dispatch, SetStateAction } from 'react';

import SorbetBackground from '@/../public/SorbetBackground.png';

import {
  Body,
  Container,
  DemoImage,
  Header,
  InstagramIcon,
  Option,
  TwitterIcon,
} from '../reusables';
import { Screen } from '../share-profile-dialog';

interface AddToSocialsProps {
  setActive: Dispatch<SetStateAction<Screen>>;
}

export const AddToSocials = ({ setActive }: AddToSocialsProps) => {
  return (
    <Container>
      <Header
        title='Add Sorbet to your socials'
        description='Add your Sorbet URL to your social profiles'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
        <DemoImage src={SorbetBackground} alt='Sorbet' />
        <div className='flex flex-col gap-6'>
          <Option
            asset={<TwitterIcon />}
            title='X'
            navigate={() => setActive('X')}
            socialIcon={true}
          />
          <Option
            asset={<InstagramIcon />}
            title='Instagram'
            navigate={() => setActive('Instagram')}
            socialIcon={true}
          />
        </div>
      </Body>
    </Container>
  );
};
