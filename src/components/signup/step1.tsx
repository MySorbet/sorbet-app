'use client';

import { FormContainer } from '../signin';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { UserSignUpContext, UserSignUpContextType } from './signup-container';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, MapPin, User } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

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
          <div className='flex flex-col gap-6 h-full'>
            <div className='flex w-full justify-between items-center'>
              <h1 className='font-semibold text-2xl'>Image</h1>
              <p className='font-medium text-sm text-[#344054]'>Step 1 of 3</p>
            </div>
            <div className='flex flex-col flex-1 gap-10'>
              <div className='h-[76px] flex w-full py-2 gap-4 items-center'>
                <Avatar className='w-[60px] h-[60px] drop-shadow-xl shadow-[#1018280F] border-[1.2px] border-[#00000014]'>
                  <AvatarImage src={image} />
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
                                !!errors.firstName
                                  ? 'border-red-500 ring-red-500'
                                  : ''
                              }
                            />
                            {errors.firstName && (
                              <CircleAlert className='h-4 w-4 text-[#D92D20] absolute right-4 top-3' />
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
                                !!errors.lastName
                                  ? 'border-red-500 ring-red-500'
                                  : ''
                              }
                            />
                            {errors.lastName && (
                              <CircleAlert className='h-4 w-4 text-[#D92D20] absolute right-4 top-3' />
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
                  <MapPin className='absolute h-5 w-5 text-[#667085] top-[10px] left-3' />
                </div>
              </div>
            </div>
            <Button
              type='submit'
              className='bg-[#573DF5] border-[#7F56D9] text-[#FFFFFF] shadow-sm shadow-[#1018280D] w-full'
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
