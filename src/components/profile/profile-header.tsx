import { SquareArrowOutUpRight } from 'lucide-react';
import React from 'react';

import { ShareProfileDialog } from '@/components/profile/share/share-profile-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { MarkerPin03, Share06 } from '@untitled-ui/icons-react';

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
      <div className='flex justify-center'>
        <Avatar className='h-20 w-20'>
          <AvatarImage
            src={user.profileImage || '/avatar.svg'}
            alt={user.accountId}
          />
          <AvatarFallback className='text-2xl font-semibold'>
            {user.accountId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className='flex justify-center'>
        {user.firstName && user.lastName && (
          <h1 className='text-2xl font-semibold'>{`${user.firstName} ${user.lastName}`}</h1>
        )}
      </div>
      <div className='flex justify-center'>
        <div className='lg:w-5/12'>
          <h1 className='text-center text-3xl font-semibold'>{user.bio}</h1>
        </div>
      </div>
      <div className='grid grid-cols-2 justify-center gap-2 md:flex md:flex-row lg:flex lg:grid-cols-none lg:flex-row'>
        {user.tags &&
          user.tags.map((tag: string) => (
            <span
              className='border-1 rounded-full border border-gray-400 px-2 py-1 text-center text-xs'
              key={tag}
            >
              {tag}
            </span>
          ))}
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
              className='px-5'
              onClick={() => onEditClick()}
            >
              <span className='text-base'>Edit Profile</span>
            </Button>
          ) : (
            <Button
              className='bg-[#573DF5] px-5 text-base'
              onClick={onHireMeClick}
              disabled={disableHireMe}
            >
              Hire Me
            </Button> // Added onClick event for Hire Me button
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
    </>
  );
};
