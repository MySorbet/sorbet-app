import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

/** Render bridge TOS in an iframe just big enough to fit it */
export const TosIframe = ({ url }: { url: string }) => {
  const [ready, setReady] = useState(false);

  // A set loading time (just needs to be longer than it takes bridge to load)
  // TODO: Is there a way we can tell when it loads?
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <VerifyCard className='h-[24rem] w-[28rem]'>
      <Skeleton className={cn('size-full', ready ? 'hidden' : 'block')} />

      <div
        className={cn(
          'size-full [&_iframe]:size-full',
          ready ? 'animate-in fade-in block duration-300' : 'hidden'
        )}
      >
        <iframe
          src={url}
          className='h-full w-full'
          style={{
            overflow: 'hidden',
          }}
          scrolling='no'
        />
      </div>
    </VerifyCard>
  );
};
