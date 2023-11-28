/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import UserOverView from '@/components/explore/userOverview';
import UserHeader from '@/components/Header/userHeader';

import { getUsersAll } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setUsers } from '@/redux/userSlice';

import UserType from '@/types/user';

const Explore = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer.user);
  const users = useAppSelector((state) => state.userReducer.users);

  useEffect(() => {
    const getAll = async () => {
      const res = await getUsersAll();
      const result = (res.data as UserType[]).filter(
        (old) => old.id != user.id
      );
      dispatch(setUsers(result));
    };
    getAll();
  }, [user]);

  return (
    <>
      <div className='flex min-h-screen w-full items-start justify-center bg-[#FAFAFA]'>
        <UserHeader />
        <div className=' grid h-full w-[80%] grid-cols-4 gap-4 pt-[150px] max-lg:grid-cols-3 max-md:grid-cols-2  max-sm:grid-cols-1'>
          {/* {users &&
            users.map((user: UserType) => (
              <div
                key={user.id}
                className='flex w-full w-full cursor-pointer flex-col gap-1 rounded-lg bg-white'
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                <img
                  src='/images/test/dribble-bg.png'
                  alt='bg'
                  className='w-full'
                />
                <div className='flex items-center justify-start gap-2 p-2'>
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt='avatar'
                      className='rounded-full'
                      width={18}
                      height={18}
                    />
                  ) : (
                    <img
                      src='/avatar.svg'
                      alt='avatar'
                      width={18}
                      height={18}
                    />
                  )}
                  <div>{user?.firstName + ' ' + user?.lastName}</div>
                </div>
              </div>
            ))} */}
          {users &&
            users.map((user: UserType) => (
              <UserOverView key={user?.id} user={user} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
