import { Body, Container, Header, Option, QRCode } from '../reusables';

export const AddToSocials = () => {
  return (
    <Container gap='6'>
      <Header
        title='Add to socials'
        description='Add your Sorbet URL to your social profiles'
        canGoBack={true}
      />
      <Body>
        <div className='h-[186px] w-full rounded-xl bg-[#D0D5DD]' />
        <div className='flex flex-col gap-6'>
          <Option asset={<div>X</div>} title='X' />
          <Option asset={<div>I</div>} title='Instagram' />
        </div>
      </Body>
    </Container>
  );
};
