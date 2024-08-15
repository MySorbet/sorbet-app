import { AlertCircle } from '@untitled-ui/icons-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white'>
        <div className='flex h-screen flex-col items-center justify-center gap-4'>
          <AlertCircle className='mb-4 size-12 text-red-500' />
          <div className='text-center'>
            <h1 className='mb-4 text-4xl font-bold'>Page does not exist.</h1>
            <Link href='/' className='text-muted-foreground hover:underline'>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
