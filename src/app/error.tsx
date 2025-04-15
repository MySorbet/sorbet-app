'use client'; // Error components must be Client Components

import { useEffect } from 'react';

import { ErrorFallback } from '@/components/common/error-fallback/error-fallback';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='flex size-full items-center justify-center'>
      <ErrorFallback type='generic'>
        <Button variant='sorbet' onClick={reset}>
          Try again
        </Button>
      </ErrorFallback>
    </main>
  );
}
