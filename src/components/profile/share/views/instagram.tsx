import { Body, Container, Header, Option, QRCode } from '../reusables';

export const Instagram = () => {
  return (
    <Container gap='6'>
      <Header
        title='Instagram'
        description='Add Sorbet to your Instagram profile. Simply copy your Sorbet URL, go to your profile, click on Edit Profile, and paste your Sorbet URL into the Website field.'
        canGoBack={true}
      />
      <Body>
        <div className='h-[186px] w-full bg-black' />
        <QRCode username='valvarez' />
        <Option asset={<div>I</div>} title='Go to my instagram' />
      </Body>
    </Container>
  );
};
