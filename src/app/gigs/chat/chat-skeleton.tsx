import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ChatSkeleton = () => {
  return (
    <div className='w-full overflow-y-hidden h-[50vh] overflow-x-hidden flex flex-col'>
      <ChatSkeleton.User />
      <ChatSkeleton.Message width={28} />
      <ChatSkeleton.Message width={20} />

      <ChatSkeleton.User />
      <ChatSkeleton.Message width={40} />

      <ChatSkeleton.User />
      <ChatSkeleton.Message width={28} />
      <ChatSkeleton.Message width={24} />
      <ChatSkeleton.Message width={20} />

      <ChatSkeleton.User />
      <ChatSkeleton.Message width={28} />
    </div>
  );
};

function User() {
  return (
    <div className='flex items-center gap-1 mt-5'>
      <Skeleton className='w-8 h-8 rounded-full bg-gray-400' />
      <Skeleton className='w-28 h-3 bg-gray-400' />
    </div>
  );
}

function Message({ width }: { width: number }) {
  return (
    <Skeleton
      className={cn('ml-8 h-10 bg-gray-400 mt-1 rounded-2xl', `w-${width}`)}
    />
  );
}

ChatSkeleton.User = User;
ChatSkeleton.Message = Message;

export { ChatSkeleton };
