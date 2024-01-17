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
      <div className='flex flex-col min-h-screen w-full items-center justify-start bg-[#F9FAFB] gap-[45px]'>
        {/* <UserHeader /> */}
        <div className='flex w-full justify-between px-8 py-4'>
          <div className='flex gap-6'>
            <img src='/svg/logo.svg' alt='logo' width={44} height={44} />
          </div>
          <div className='flex items-center justify-end gap-4'>
            <img
              src='/images/menu.svg'
              alt='menu'
              className=' cursor-pointer p-[10px]'
            />
          </div>
        </div>
        <div className='flex flex-col w-[1280px] items-start gap-6'>
          <div className='flex flex-row items-center gap-4 self-stretch'>
            <div className='flex '>

            </div>
          </div>
        </div>
        <div className=' grid h-full w-[80%] grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2  max-sm:grid-cols-1'>
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
