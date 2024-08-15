import { Body, Container, Header, Option, QRCode } from '../reusables';

export const ShareMyProfile = () => {
  return (
    <Container gap='6'>
      <Header
        title='Share my profile'
        description='Get noticed by adding your Sorbet URL to your social channels'
        canGoBack={true}
      />
      <Body>
        <div className='flex flex-col gap-6'>
          <Option asset={<div>T</div>} title='X' />
          <Option asset={<div>I</div>} title='Instagram' />
        </div>
        <QRCode username='valvarez' />
      </Body>
    </Container>
  );
};
