/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SelectRole = () => {
  const router = useRouter();
  const [selectRole, setSelectRole] = useState(false);

  const onChange = (e: any) => {
    setSelectRole(e.target.checked);
  };

  const signInWithRole = async () => {
    const role = selectRole ? 'client' : 'freelancer';
    localStorage.setItem('role', JSON.stringify(role));
    router.push('/profile');
  };

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 pt-4 text-black max-sm:w-[300px]'>
        <div className='mb-3 flex justify-end'>
          <img src='/images/cancel.png' alt='cancel' className='h-10 w-10' />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='text-[32px]'>Selete the Role</h1>

          <div className='flex w-full items-center justify-start gap-3'>
            <input
              type='checkbox'
              id='checkbox'
              checked={selectRole}
              onChange={onChange}
            />
            <label htmlFor='checkbox'>As signin with Client </label>
          </div>
        </div>
        <div className='item w-full'>
          <button
            className='bg-primary-default h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
            onClick={signInWithRole}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
