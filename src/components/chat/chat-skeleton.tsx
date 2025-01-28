import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ChatSkeleton = () => {
  return (
    <div className='flex h-[50vh] w-full flex-col overflow-x-hidden overflow-y-hidden px-2 py-3'>
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
    <div className='mt-5 flex items-center gap-1'>
      <Skeleton className='h-8 w-8 rounded-full bg-gray-400' />
      <Skeleton className='h-3 w-28 bg-gray-400' />
    </div>
  );
}

function Message({ width }: { width: number }) {
  return (
    <Skeleton
      className={cn('ml-8 mt-1 h-10 rounded-2xl bg-gray-400', `w-${width}`)}
    />
  );
}

ChatSkeleton.User = User;
ChatSkeleton.Message = Message;

export { ChatSkeleton };
