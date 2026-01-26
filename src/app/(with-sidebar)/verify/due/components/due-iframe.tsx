import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from '../../components/verify-card';

export const DueIframe = ({
  url,
  className,
}: {
  url: string;
  className?: string;
}) => {
  const [ready, setReady] = useState(false);

  return (
    <VerifyCard
      className={cn(
        'h-[30rem] w-full max-w-[28rem] overflow-clip p-0',
        className
      )}
    >
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
          onLoad={() => setTimeout(() => setReady(true), 500)}
        />
      </div>
    </VerifyCard>
  );
};
