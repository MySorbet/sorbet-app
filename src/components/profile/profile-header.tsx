import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ProfileHeaderProps {
  avatar: string;
  username: string;
  fullName: string;
  bio: string;
  tags: string[];
  onEditClick: () => void;
  editMode: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatar,
  username,
  fullName,
  bio,
  tags,
  onEditClick,
  editMode,
}) => {
  return (
    <>
      {editMode && (
        <div className='absolute left-1/2 top-0 transform -translate-x-1/2 translate-y-12 z-50'>
          <Alert className='bg-[#573DF5] text-white border-[#573DF5]'>
            <AlertTitle>Editing</AlertTitle>
            <AlertDescription>
              You are currently in edit mode. Click <b>Save Changes</b> or{' '}
              <b>Discard</b> to exit.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className='flex justify-center'>
        <Avatar className={`w-20 h-20`}>
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex justify-center'>
        <h1 className='text-2xl font-semibold'>{fullName}</h1>
      </div>
      <div className='flex justify-center'>
        <div className='w-5/12'>
          <h1 className='text-3xl font-semibold text-center'>{bio}</h1>
        </div>
      </div>
      <div className='flex flex-row gap-2 justify-center'>
        {tags.map((tag: string) => (
          <span className='border border-1 border-gray-400 py-1 px-2 rounded-full text-xs'>
            {tag}
          </span>
        ))}
      </div>
      <div className='flex flex-row gap-3 justify-center mt-4'>
        <Button className='bg-[#573DF5] px-5'>Hire Me</Button>
        <Button
          variant='outline'
          className='px-5'
          onClick={() => onEditClick()}
        >
          {editMode ? <span>Save Changes</span> : <span>Edit Profile</span>}
        </Button>
        {editMode && (
          <Button
            variant='outline'
            className='px-5'
            onClick={() => onEditClick()}
          >
            <span>Discard</span>
          </Button>
        )}
      </div>
    </>
  );
};
