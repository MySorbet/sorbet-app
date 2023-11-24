/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import UserHeader from '@/components/Header/userHeader';

import { getUsersAll } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getUsers } from '@/redux/userSlice';

import UserType from '@/types/user';

const Explore = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    const res = await getUsersAll();
    setUsers(res.data);
    dispatch(getUsers(res.data));
  };

  return (
    <>
      <div className='flex min-h-screen w-full items-start justify-start bg-[#F2F2F2]'>
        <UserHeader />
        <div className='container m-auto grid h-full w-full grid-cols-4 gap-4'>
          {users &&
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
            ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
