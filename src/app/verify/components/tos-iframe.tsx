import { VerifyCard } from './verify-card';

const TOS_URL =
  'https://dashboard.bridge.xyz/accept-terms-of-service?customer_id=fdaf8561-32a1-4334-bc05-941f2cff7721';

export const TosIframe = () => {
  return (
    <VerifyCard className='h-[25rem] w-[32rem]'>
      <iframe
        src={TOS_URL}
        className='h-full w-full'
        style={{
          overflow: 'hidden',
        }}
        scrolling='no'
      />
    </VerifyCard>
  );
};
