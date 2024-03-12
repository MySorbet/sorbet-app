import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import React from 'react';

interface ProfileHeaderProps {
  avatar: string;
  username: string;
  fullName: string;
  bio: string;
  tags: string[];
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatar,
  username,
  fullName,
  bio,
  tags,
}) => {
  return (
    <>
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
        <Button variant='outline' className='px-5'>
          Edit Profile
        </Button>
      </div>
    </>
  );
};
