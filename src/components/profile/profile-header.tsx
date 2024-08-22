import { MarkerPin03, Share06 } from '@untitled-ui/icons-react';
import React from 'react';

import { ShareProfileDialog } from '@/components/profile/share/share-profile-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface ProfileHeaderProps {
  canEdit: boolean;
  user: User;
  onEditClick: () => void;
  onHireMeClick?: () => void;
  disableHireMe?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  canEdit,
  user,
  onEditClick,
  onHireMeClick,
  disableHireMe = false,
}) => {
  const handleUrlToClipboard = () => () => {
    const username = user.accountId.split('.')[0];
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <>
      {/* Avatar start */}
      <div className='flex justify-center'>
        <Avatar className='h-[100px] w-[100px]'>
          <AvatarImage
            src={user.profileImage || '/avatar.svg'}
            alt={user.accountId}
          />
          <AvatarFallback className='text-2xl font-semibold'>
            {user.accountId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* Avatar end */}
      {/* Name start */}
      <div className='flex justify-center'>
        {user.firstName && user.lastName && (
          <h1 className='text-2xl font-bold text-[#101828]'>{`${user.firstName} ${user.lastName}`}</h1>
        )}
      </div>
      {/* Name end */}
      {/* City start */}
      <div className='flex items-center gap-1'>
        <MarkerPin03 className='h-4 w-4 text-[#667085]' />
        <span className='text-xs leading-[18px] text-[#667085]'>
          {user.city}
        </span>
      </div>
      {/* City end */}
      {/* Bio start */}
      <div className='flex justify-center'>
        <div className='lg:w-7/12'>
          <h1 className='text-center text-4xl font-bold leading-[44px]'>
            {user.bio}
          </h1>
        </div>
      </div>
      {/* Bio end */}
      {/* Tags start */}
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
      {/* Tags end */}
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
      {/* CTAs start */}
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
            <Button
              className='bg-[#573DF5] px-5 text-base'
              onClick={onHireMeClick}
              disabled={disableHireMe}
            >
              Hire Me
            </Button>
          )}
          <ShareProfileDialog
            trigger={
              <Button
                className='align-center flex flex-row items-center gap-2 bg-inherit text-[#573DF5] hover:bg-inherit'
                onClick={handleUrlToClipboard()}
              >
                <Share06 className='h-5 w-5' />
                <span className='text-base'>Share</span>
              </Button>
            }
            username={user.accountId.split('.')[0]}
          />
        </div>
      )}
      {/* CTAs end */}
    </>
  );
};
