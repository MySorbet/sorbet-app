/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import UserType from '@/types/user';

interface Props {
  user: UserType;
}

const UserOverView = ({ user }: Props) => {

  return (
    <div className='flex flex-col items-start justify-between gap-3 bg-white w-[310px] rounded-[32px]'>
      <div className='flex flex-col items-start gap-4 self-stretch px-4 pt-4'>
        <div className='flex justify-between self-stretch'>
          <div className='flex items-center gap-1'>
            {user?.profileImage ? (
              <img
                src={user?.profileImage}
                className='rounded-full'
                width={32}
                height={32}
              />
            ) : (
              <img src='/avatar.svg' width={32} height={32} />
            )}
            <div className='flex flex-col items-start'>
              <div className='text-sm font-bold'>
                {user?.firstName + ' ' + user?.lastName}
              </div>
              <div className='text-[10px] font-normal'>{user?.title}</div>
            </div>
          </div>
          <div className='flex h-[22px] items-center gap-1 bg-[#ABEFC6] rounded-full border border-[#ECFDF3] p-0.5'>
            <div className='h-2 w-2 rounded-full bg-[#17B26A]'></div>
            <div className='text-center py-0.5 px-2 text-xs font-medium text-[#067647]'>
              Available
            </div>
          </div>
        </div>
        <div className='flex flex-wrap content-start items-start gap-1.5'>
          {user.tags &&
            user.tags.map((skill, index) => (
              <div
                key={index}
                className='rounded-full border-[1.5px] border-[#D0D5DD] px-2 py-0.5 text-xs font-medium text-[#344054]'
              >
                {skill}
              </div>
            ))}
        </div>
      </div>
        <div
          className={`w-full h-[310px] `}
          style={{
            backgroundImage: `url(${user?.profileBannerImage? user.profileBannerImage : 'profile-bg-default.svg'})`,
            backgroundSize: 'cover',
            borderRadius: '0 0 32px 32px', // Add this line for rounded corners
          }}
        ></div>
    </div>
  );
};

export default UserOverView;
