import UserWidgetContainer from '@/components/profile/addWidget/UserWidgetContainer';
import { useRouter } from 'next/navigation';

interface Props {
  user: any;
}

const UserOverView = ({ user }: Props) => {
  const router = useRouter();
  return (
    <div
      className='flex h-[300px] w-full cursor-pointer flex-col items-start justify-between gap-1 rounded-lg border-2 bg-gray-300'
      onClick={() => router.push(`/profile/${user.id}`)}
    >
      <div className='grid w-full grid-cols-2 items-start gap-1 overflow-hidden'>
        {user.widgets?.map((widget: any) => {
          return (
            <UserWidgetContainer
              key={widget?.id}
              link={widget?.url}
              type={widget?.type}
              size='small'
            />
          );
        })}
      </div>
      <div className='flex w-full items-center justify-start gap-2 p-2'>
        {user?.profileImage ? (
          <img
            src={user?.profileImage}
            alt='avatar'
            className='rounded-full'
            width={18}
            height={18}
          />
        ) : (
          <img src='/avatar.svg' alt='avatar' width={18} height={18} />
        )}
        <div>{user?.firstName + ' ' + user?.lastName}</div>
      </div>
    </div>
  );
};

export default UserOverView;
