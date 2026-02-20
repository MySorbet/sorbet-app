'use client';

import { Spinner } from '@/components/common/spinner';

export const FullscreenLoader = ({
  label = 'Loading…',
}: {
  label?: string;
}) => {
  return (
    <div className='bg-background/70 fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm'>
      <div className='bg-background flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm'>
        <Spinner className='size-5' />
        <span className='text-foreground text-sm'>{label}</span>
      </div>
    </div>
  );
};
