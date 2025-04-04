import { MarkerPin03, Share06, User01 } from '@untitled-ui/icons-react';
import { parseAsBoolean, useQueryState } from 'nuqs';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/flags';
import { User } from '@/types';

import { ShareProfileDialog } from './share/share-profile-dialog';

interface ProfileHeaderProps {
  canEdit: boolean;
  user: User;
  onEditClick: () => void;
  onHireMeClick?: () => void;
  disableHireMe?: boolean;
  hideShare?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  canEdit,
  user,
  onEditClick,
  onHireMeClick,
  disableHireMe = false,
  hideShare = false,
}) => {
  const handle = user.handle;
  if (!handle) {
    throw new Error('User handle is required');
  }

  const handleUrlToClipboard = () => () => {
    const url = `${window.location.origin}/${handle}`;
    navigator.clipboard.writeText(url);
  };

  const [isShareDialogOpen, setIsShareDialogOpen] = useQueryState(
    'shareDialogOpen',
    parseAsBoolean.withDefault(false)
  );

  return (
    <>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex justify-center'>
          <Avatar className='size-24'>
            <AvatarImage src={user.profileImage} alt={handle} />
            <AvatarFallback className='border-primary-default border-2'>
              <User01 className='text-muted-foreground h-12 w-12' />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className='flex justify-center'>
            {user.firstName && user.lastName && (
              <h1 className='text-2xl font-bold text-[#101828]'>{`${user.firstName} ${user.lastName}`}</h1>
            )}
          </div>
          <div className='flex flex-col items-center gap-1'>
            {user.city && (
              <div className='flex items-center gap-1'>
                <MarkerPin03 className='h-4 w-4 text-[#667085]' />
                <span className='text-xs leading-[18px] text-[#667085]'>
                  {user.city}
                </span>
              </div>
            )}
            <div className='flex justify-center'>
              <div className='max-w-prose'>
                <h1 className='text-center text-4xl font-bold leading-[44px]'>
                  {user.bio}
                </h1>
              </div>
            </div>
            <div className='grid grid-cols-2 justify-center gap-1 md:flex md:flex-row lg:flex lg:grid-cols-none lg:flex-row'>
              {user.tags &&
                user.tags.map((tag: string) => (
                  <span
                    className='rounded-full border-[1.5px] border-[#D0D5DD] px-2 py-[2px] text-xs font-medium leading-[18px] text-[#344054]'
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        {(!user.firstName || !user.lastName || !user.bio) && canEdit && (
          <div className='flex w-full justify-center'>
            <div className='text-sorbet border-1 border-sorbet rounded-lg border border-dashed p-4'>
              <i>
                You can start adding your profile info using the Edit Profile
                button below
              </i>
            </div>
          </div>
        )}
      </div>
      {user && (
        <div className='flex flex-row items-center justify-center gap-6'>
          {canEdit ? (
            <Button
              variant='outline'
              className='rounded-lg border-[#D0D5DD] px-4 py-[10px] drop-shadow-sm'
              onClick={() => onEditClick()}
            >
              <span className='text-base text-[#344054]'>Edit Profile</span>
            </Button>
          ) : (
            featureFlags.hireMe && (
              <Button
                className='bg-[#573DF5] px-5 text-base'
                onClick={onHireMeClick}
                disabled={disableHireMe}
              >
                Hire Me
              </Button>
            )
          )}
          {!hideShare && (
            <ShareProfileDialog
              open={isShareDialogOpen}
              setOpen={setIsShareDialogOpen}
              trigger={
                <Button
                  className='align-center group flex flex-row items-center gap-2 bg-inherit px-0 text-[#573DF5] hover:bg-inherit'
                  onClick={handleUrlToClipboard()}
                >
                  <Share06 className='h-5 w-5 transition ease-in-out group-hover:translate-x-[1px] group-hover:translate-y-[-0.5px] group-hover:rotate-6' />
                  <span className='text-base'>Share</span>
                </Button>
              }
              username={handle}
            />
          )}
        </div>
      )}
    </>
  );
};
