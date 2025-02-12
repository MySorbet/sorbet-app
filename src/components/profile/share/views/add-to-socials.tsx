import { Dispatch, SetStateAction } from 'react';

import SorbetBackground from '~/images/SorbetBackground.png';

import {
  Body,
  DemoImage,
  Header,
  InstagramIcon,
  Option,
  TwitterIcon,
} from '../components';
import { View } from '../share-profile-dialog';

interface AddToSocialsProps {
  setActive: Dispatch<SetStateAction<View>>;
}

export const AddToSocials = ({ setActive }: AddToSocialsProps) => {
  return (
    <>
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
    </>
  );
};
