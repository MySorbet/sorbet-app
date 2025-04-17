import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/** Let a user know that `handle` is available and give them a call to action to claim it */
export const HandleAvailable = ({ handle }: { handle: string }) => {
  // TODO: Consider a dynamic hostname, but hardcode now since we can make it a server component
  const hostname = 'mysorbet.io';

  return (
    <div className='animate-in fade-in-0 slide-in-from-bottom-2 flex size-full items-center justify-center duration-200 ease-out'>
      <div className='container flex w-full max-w-80 flex-col items-center gap-10 py-4'>
        <Image
          src='/svg/logo.svg'
          width={80}
          height={80}
          className='size-20'
          alt='Sorbet'
          priority
        />
        <Input
          value={handle}
          prefix={`${hostname}/`}
          aria-label='Handle available'
          readOnly
          rootClassName='w-full'
          className='font-semibold focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <div className='flex w-full flex-col items-center gap-1'>
          <p className='text-muted-foreground text-sm'>Handle available</p>
          <Button variant='sorbet' className='w-full' asChild>
            <Link href={`/signin?handle=${handle}`}>Sign up to claim</Link>
          </Button>
          <Button variant='secondary' className='w-full' asChild>
            <a
              href='https://mysorbet.xyz/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn more
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
