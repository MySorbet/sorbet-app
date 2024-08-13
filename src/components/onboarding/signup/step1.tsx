'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, MapPin, User } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { FormContainer } from '../form-container';
import { UserSignUpContext, UserSignUpContextType } from './signup';

const Step1 = () => {
  const { userData, setUserData, setStep } = useContext(
    UserSignUpContext
  ) as UserSignUpContextType;
  const [image, setImage] = useState<string | undefined>('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const [location, setLocation] = useState<string>('');

  const schema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
  });

  const handleNext = (data: { firstName: string; lastName: string }) => {
    setUserData((user) => ({
      ...user,
      location,
      image,
      file,
      firstName: data.firstName,
      lastName: data.lastName,
    }));
    setStep(2);
  };

  const handleFileChange = (e: any) => {
    setFile(
      e.target.files && e.target.files.length > 0
        ? e.target.files[0]
        : undefined
    );
    const i = e.target.files[0];
    setImage(URL.createObjectURL(i));
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    mode: 'all',
  });

  const { isValid, touchedFields, errors } = useFormState({
    control: form.control,
  });

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleNext)}>
          <div className='flex h-full flex-col gap-6'>
            <div className='flex w-full items-center justify-between'>
              <h1 className='text-2xl font-semibold'>Bio</h1>
              <p className='text-sm font-medium text-[#344054]'>Step 1 of 3</p>
            </div>
            <div className='flex flex-1 flex-col gap-10'>
              <div className='flex h-[76px] w-full items-center gap-4 py-2'>
                <Avatar className='h-[60px] w-[60px] border-[1.2px] border-[#00000014] shadow-[#1018280F]'>
                  <AvatarImage src={image} />
                  <AvatarFallback className='h-[60px] w-[60px] bg-[#F2F4F7] '>
                    <User className='h-9 w-9 text-[#667085]' />
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
                    onChange={(e) => handleFileChange(e)}
                    type='file'
                    className='hidden'
                    accept='image/*'
                  />
                </label>
              </div>
              <div className='flex flex-row gap-6'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => {
                    return (
                      <FormItem className='space-y-[6px]'>
                        <FormLabel className='text-sm text-[#344054]'>
                          First name *
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              {...form.register('firstName')}
                              placeholder='First name'
                              {...field}
                              className={
                                errors.firstName
                                  ? 'border-red-500 ring-red-500'
                                  : ''
                              }
                            />
                            {errors.firstName && (
                              <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => {
                    return (
                      <FormItem className='space-y-[6px]'>
                        <FormLabel className='text-sm text-[#344054]'>
                          Last name *
                        </FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              {...form.register('lastName')}
                              placeholder='Last name'
                              {...field}
                              className={
                                errors.lastName
                                  ? 'border-red-500 ring-red-500'
                                  : ''
                              }
                            />
                            {errors.lastName && (
                              <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className='flex flex-col gap-[6px]'>
                <h1 className='text-sm text-[#344054]'>
                  Where are you located?
                </h1>
                <div className='relative'>
                  <Input
                    placeholder='Enter location'
                    className='pl-10'
                    onChange={(e) => setLocation(e.target.value)}
                    defaultValue={userData.location}
                  />
                  <MapPin className='absolute left-3 top-[10px] h-5 w-5 text-[#667085]' />
                </div>
              </div>
            </div>
            <Button
              type='submit'
              className='w-full border-[#7F56D9] bg-[#573DF5] text-[#FFFFFF] shadow-sm shadow-[#1018280D]'
              // onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </FormContainer>
  );
};

export { Step1 };
