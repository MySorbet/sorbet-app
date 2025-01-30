import { VerifyCard } from './verify-card';

/** Render bridge TOS in an iframe just big enough to fit it */
export const TosIframe = ({ url }: { url: string }) => {
  return (
    <VerifyCard className='h-[24rem] w-[28rem]'>
      <iframe
        src={url}
        className='h-full w-full'
        style={{
          overflow: 'hidden',
        }}
        scrolling='no'
      />
    </VerifyCard>
  );
};
