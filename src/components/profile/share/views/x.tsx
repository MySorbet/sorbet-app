import { Body, Container, Header, Option, QRCode } from '../reusables';

export const XTwitter = () => {
  return (
    <Container gap='6'>
      <Header
        title='X'
        description='Add Sorbet to your X profile. Simply copy your Sorbet URL, go to your profile, click on Edit Profile, and paste your Sorbet URL into the Website field.'
        canGoBack={true}
      />
      <Body>
        <div className='h-[186px] w-full bg-black' />
        <QRCode username='valvalrez' />
        <Option asset={<div>X</div>} title='Go to my X' />
      </Body>
    </Container>
  );
};
