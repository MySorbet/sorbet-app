'use client';

import { FormContainer } from '../signin';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MapPin, User } from 'lucide-react';

const Step1 = () => {
  return (
    <FormContainer>
      <div className='flex flex-col gap-6 h-full'>
        <div className='flex w-full justify-between items-center'>
          <h1 className='font-semibold text-2xl'>Image</h1>
          <p className='font-medium text-sm text-[#344054]'>Step 1 of 3</p>
        </div>
        <div className='flex flex-col flex-1 gap-10'>
          <div className='h-[76px] flex w-full py-2 gap-4 items-center'>
            <Avatar className='w-[60px] h-[60px] drop-shadow-xl shadow-[#1018280F] border-[1.2px] border-[#00000014]'>
              <AvatarImage />
              <AvatarFallback className='w-[60px] h-[60px] bg-[#F2F4F7] '>
                <User className='text-[#667085] w-9 h-9' />
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor='profileImage'
              className='flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border-[1px] border-[#D0D5DD] px-3 py-2 text-sm font-semibold'
            >
              Upload Avatar
              <input
                id='profileImage'
                name='profileImage'
                onChange={(e) => console.log(e)}
                type='file'
                className='hidden'
                accept='image/*'
              />
            </label>
          </div>
          <div className='flex flex-col gap-[6px]'>
            <h1 className='text-sm text-[#344054]'>Where are you located?</h1>
            <div className='relative'>
              <Input placeholder='Enter location' className='pl-10' />
              <MapPin className='absolute h-5 w-5 text-[#667085] top-[10px] left-3' />
            </div>
          </div>
        </div>
        <Button className='bg-[#573DF5] border-[#7F56D9] text-[#FFFFFF] shadow-sm shadow-[#1018280D] w-full'>
          Next
        </Button>
      </div>
    </FormContainer>
  );
};

export { Step1 };
