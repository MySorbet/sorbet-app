'use client';

import Link from 'next/link';
import { useState } from 'react';

// TODO: Move to ./components
import { EditProfileSheet } from '@/components/profile/edit-profile-sheet';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

import { OnboardWithHandles } from './onboard-with-handles';
import { ProfileDetails } from './profile-details';

/** Profile 2.0 */
export const Profile = ({ user, isMine }: { user: User; isMine?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='flex min-h-full w-full'>
      <div className='flex h-full max-w-96 flex-col justify-between gap-6 p-6 pb-0'>
        <ProfileDetails
          user={user}
          isMine={isMine}
          onEdit={() => setIsEditing(true)}
        />
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
      {/* TODO: Eventually this will be the widget grid. For now just show onboarding */}
      <div className='size-full flex-1'>
        {isMine && (
          <div className='flex size-full items-center justify-center'>
            <OnboardWithHandles />
          </div>
        )}
      </div>
      <EditProfileSheet open={isEditing} setOpen={setIsEditing} user={user} />
    </div>
  );
};
