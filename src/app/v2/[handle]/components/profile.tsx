import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { User } from '@/types';

import { ProfileDetails } from './profile-details';

/** Profile 2.0 */
export const Profile = ({ user }: { user: User }) => {
  return (
    <div className='flex min-h-full w-full'>
      <div className='flex h-full max-w-96 flex-col justify-between gap-6 p-6 pb-0'>
        <ProfileDetails user={user} />
        {/* TODO: Could/should these buttons auto open the privy via a query param? */}
        <div className='flex gap-3'>
          <Button variant='secondary' asChild>
            <Link href='/signin'>Create my Sorbet</Link>
          </Button>
          <Button variant='ghost' asChild>
            <Link href='/signin'>Login</Link>
          </Button>
        </div>
      </div>
      {/* Widgets placeholder */}

      <div className='border-muted size-full h-full flex-1 rounded-3xl border-2 border-dashed' />
    </div>
  );
};
