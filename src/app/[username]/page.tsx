'use client';

import { getUserByAccountId } from '@/api/user';
import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useEffect, useState } from 'react';

const UserProfile = ({ params }: { params: { username: string } }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [notFound, setNotFound] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      if (params.username.length > 0) {
        const userResponse = await getUserByAccountId(params.username);
        if (userResponse.data) {
          setUser(userResponse.data as User);
        } else {
          setNotFound(true);
        }
      }
    };
    fetchUser();
  }, [params.username]);

  return (
    <>
      {!notFound && <Header isPublic />}
      {user && <Profile user={user} />}
      {notFound && (
        <div className='container mt-4 w-full h-[100vh]'>
          <div className='flex flex-col gap-10 w-full h-full justify-center items-center align-center'>
            <div>
              <img src='/svg/logo.svg' alt='logo' width={100} height={100} />
            </div>
            <div>
              <div className='bg-gray-100 p-6 border border-1 border-gray-200 text-4xl justify-center flex rounded-xl'>
                <span className='text-gray-500'>mysorbet.xyz/</span>
                <span>{params.username}</span>
              </div>
              <div className='mt-4 text-center'>
                The handle is available for you to build your internet presence
                today!
              </div>
            </div>
            <Button size={`lg`} className='bg-sorbet text-xl'>
              Claim Handle Today
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
