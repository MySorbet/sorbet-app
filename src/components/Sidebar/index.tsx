/* eslint-disable @next/next/no-img-element */
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { LOCAL_KEY } from '@/constant/constant';
import { reset } from '@/redux/contractSlice';
import { useAppDispatch } from '@/redux/hook';
import { setOpenSidebar } from '@/redux/userSlice';
import UserType from '@/types/user';
import { useRouter } from 'next/navigation';

interface props {
  openSideBar: boolean;
  userInfo: UserType;
}

const Sidebar = ({ openSideBar, userInfo }: props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { modal: nearModal, selector } = useWalletSelector();

  const logout = async () => {
    dispatch(reset());
    if (userInfo?.email) {
      localStorage.removeItem(LOCAL_KEY);
      router.push('/signin');
    } else {
      const wallet = await selector.wallet();
      wallet
        .signOut()
        .then(() => {
          router.push('/signin');
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div
      className={`fixed left-0 z-10 h-[100v] w-screen overflow-y-auto ${
        openSideBar && 'inset-0 bg-[#0C111D70]'
      }`}
      onClick={() => dispatch(setOpenSidebar(false))}
    >
      <div
        className={`right-0 z-50 m-6 flex h-[calc(100%-48px)] w-[360px] flex-col items-start justify-between gap-6 overflow-y-auto rounded-[32px] bg-white p-8 text-black ${
          openSideBar ? 'fixed' : 'hidden'
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='flex h-full w-full flex-col justify-between gap-10 text-[#101828]'>
          <div className='flex w-full flex-col gap-10'>
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center justify-between gap-2'>
                {userInfo?.profileImage ? (
                  <img
                    src={userInfo?.profileImage}
                    alt='logo'
                    className='rounded-full w-10 h-10'
                  />
                ) : (
                  <img
                    src='/avatar.svg'
                    className='rounded-full'
                    alt='logo'
                    width={40}
                    height={40}
                  />
                )}
                <div className='text-base font-bold '>
                  {userInfo?.firstName + ' ' + userInfo?.lastName}
                </div>
              </div>
              <img
                src='/images/log-out.svg'
                className='cursor-pointer'
                alt='logout'
                width={20}
                height={20}
                onClick={() => logout()}
              />
            </div>
            <div className='flex flex-col items-start text-2xl font-bold'>
              <div
                className='flex cursor-pointer items-center px-3 py-2'
                onClick={() => {
                  router.push('/auth/profile');
                  dispatch(setOpenSidebar(false));
                }}
              >
                Profile
              </div>
              <div
                className='flex cursor-pointer items-center px-3 py-2'
                onClick={() => {
                  router.push('/auth/explore');
                  dispatch(setOpenSidebar(false));
                }}
              >
                Explore
              </div>
              <div
                className='flex cursor-pointer items-center px-3 py-2'
                onClick={() => {
                  router.push('/auth/gigs');
                  dispatch(setOpenSidebar(false));
                }}
              >
                Gigs
              </div>
              <div className='flex cursor-pointer items-center px-3 py-2'>
                Settings
              </div>
            </div>
          </div>
          <div className='h-[280px] w-full rounded-2xl bg-[#D9D9D9]'></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
