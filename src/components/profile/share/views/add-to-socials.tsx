import {
  Body,
  Container,
  Header,
  Option,
  QRCode,
  TwitterIcon,
  InstagramIcon,
} from '../reusables';
import { ViewProps } from '../share-profile-dialog';
import Image from 'next/image'
import SorbetBackground from '@/../public/SorbetBackground.png'

export const AddToSocials = ({ username, setActive }: ViewProps) => {
  return (
    <Container gap='6'>
      <Header
        title='Add to socials'
        description='Add your Sorbet URL to your social profiles'
        canGoBack={true}
        navigateToPrevious={() => setActive('ShareYourProfile')}
      />
      <Body>
      <Image src={SorbetBackground} height={186} width={368} alt="Sorbet" className='object-cover w-auto rounded-3xl'/>
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
