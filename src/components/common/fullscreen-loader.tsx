'use client';

import { Spinner } from '@/components/common/spinner';

export const FullscreenLoader = ({ label = 'Loading…' }: { label?: string }) => {
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm'>
      <div className='flex items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-sm'>
        <Spinner className='size-5' />
        <span className='text-sm text-foreground'>{label}</span>
      </div>
    </div>
  );
};

