import { Metadata } from 'next';
import Link from 'next/link';

import { ErrorFallback } from '@/components/common/error-fallback/error-fallback';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main className='flex size-full items-center justify-center'>
      <ErrorFallback type='not-found'>
        <Button variant='sorbet' asChild>
          <Link href='/'>Back to Sorbet</Link>
        </Button>
      </ErrorFallback>
    </main>
  );
}
