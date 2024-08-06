import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

interface MessageAvatarProps {
  avatar: string | undefined;
  nickname: string;
  time?: string;
}

export const MessageAvatar = ({
  avatar,
  nickname,
  time,
}: MessageAvatarProps) => {
  return (
    <div className='flex items-center gap-1 mt-4'>
      <Avatar className='flex justify-center items-center'>
        <AvatarImage
          src={avatar}
          alt={nickname}
          width={32}
          height={32}
          className='h-8 w-8 rounded-full'
        />
        <AvatarFallback className='h-full w-full overflow-clip'>
          <Image
            src='./avatar.svg'
            width={40}
            height={40}
            alt='fallback'
            className='h-full w-full'
          />
        </AvatarFallback>
      </Avatar>
      <span className='text-sm text-[#344054]'>{nickname}</span>
      <span className='text-sm text-[#666666]'>{time}</span>
    </div>
  );
};
