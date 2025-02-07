import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

/** Render bridge TOS in an iframe just big enough to fit it */
export const TosIframe = ({
  url,
  onComplete,
}: {
  url: string;
  onComplete?: (signedAgreementId: string) => void;
}) => {
  const [ready, setReady] = useState(false);

  // Listen for the iframe message to know when the TOS has been accepted
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from the TOS iframe URL
      if (event.origin !== new URL(url).origin) return;

      // Check if the message contains signedAgreementId
      if (event.data?.signedAgreementId) {
        onComplete?.(event.data.signedAgreementId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete, url]);

  return (
    <VerifyCard className='h-[24rem] w-[28rem]'>
      {!ready && <Skeleton className='size-full' />}

      <div
        className={cn(
          'animate-in fade-in size-full duration-500 [&_iframe]:size-full',
          ready ? 'block' : 'hidden'
        )}
      >
        <iframe
          src={url}
          className='h-full w-full'
          style={{
            overflow: 'hidden',
          }}
          scrolling='no'
          onLoad={() => setTimeout(() => setReady(true), 500)}
        />
      </div>
    </VerifyCard>
  );
};
