import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
    <div className='flex items-center gap-1 mt-5'>
      <Avatar className='flex justify-center items-center'>
        <AvatarImage
          src={avatar ? avatar : '/avatar.svg'}
          alt={nickname}
          width={6}
          height={6}
        />
        <AvatarFallback>{nickname[0]}</AvatarFallback>
      </Avatar>
      <span className='text-sm text-[#344054]'>{nickname}</span>
      <span className='text-sm text-[#666666]'>{time}</span>
    </div>
  );
};
