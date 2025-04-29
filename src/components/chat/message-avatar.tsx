import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

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
    <div className='mt-4 flex items-center gap-1'>
      <Avatar className='flex items-center justify-center'>
        <AvatarImage
          src={avatar}
          alt={nickname}
          width={32}
          height={32}
          className='h-8 w-8 rounded-full'
        />
        <AvatarFallback className='h-full w-full overflow-clip'>
          <User className='text-muted-foreground size-full' />
        </AvatarFallback>
      </Avatar>
      <span className='text-sm text-[#344054]'>{nickname}</span>
      <span className='text-sm text-[#666666]'>{time}</span>
    </div>
  );
};
