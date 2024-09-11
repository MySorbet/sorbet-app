'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, CircleCheck, User } from 'lucide-react';
import { ChangeEventHandler, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { checkHandleIsAvailable } from '@/api/auth';
import { LocationInput } from '@/components/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';

import { FormContainer } from '../form-container';
import { useUserSignUp } from './signup';

// TODO: debounce so that not too many requests are made when typing
const refine = async (handle: string, initialHandle: string) => {
  if (handle === initialHandle) return true; // initial handle generated for this user is allowed
  if (handle.length === 0) return false;
  const res = await checkHandleIsAvailable(handle);
  return res.data.isUnique;
};

const Step1 = () => {
  const { user } = useAuth();
  const { userData, setUserData, setStep } = useUserSignUp();
  const [image, setImage] = useState<string | undefined>('');
  const [file, setFile] = useState<File | undefined>(undefined);
  const hostname = window.location.hostname; // TODO: Is there a better way to get hostname?

  const formSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    handle: z
      .string()
      .min(1, { message: 'Handle is required' })
      .refine((handle) => refine(handle, user?.handle ?? ''), {
        message: 'Handle is already taken',
      }),
    location: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Need default values because the form is a controlled component
    defaultValues: {
      ...userData,
    },
    mode: 'all',
  });

  const { errors, dirtyFields, isValid } = useFormState({
    control: form.control,
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setUserData((user) => ({
      ...user,
      ...values,
      image,
      file,
    }));
    setStep(2);
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setImage(URL.createObjectURL(file));
  };

  return (
    <FormContainer>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='h-full'>
          <div className='flex h-full flex-col justify-between gap-5'>
            <div className='flex w-full items-center justify-between'>
              <h1 className='text-2xl font-semibold'>Bio</h1>
              <p className='text-sm font-medium text-[#344054]'>Step 1 of 3</p>
            </div>
            <div className='flex flex-1 flex-col gap-6'>
              <div className='flex w-full items-center gap-4'>
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
              <FormField
                control={form.control}
                name='handle'
                render={({ field }) => {
                  return (
                    <FormItem className='space-y-[6px]'>
                      <FormLabel className='text-sm text-[#344054]'>
                        Handle *
                      </FormLabel>
                      <FormDescription>
                        Claim your unique Sorbet handle
                      </FormDescription>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            {...form.register('handle')}
                            placeholder='Handle'
                            prefix={`${hostname}/`}
                            {...field}
                            className={cn(
                              errors.handle && 'border-red-500 ring-red-500'
                            )}
                          />
                          {errors.handle ? (
                            <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
                          ) : (
                            <CircleCheck className='absolute right-4 top-3 h-4 w-4 text-[#00A886]' />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
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
                              className={cn(
                                errors.firstName &&
                                  'border-red-500 ring-red-500'
                              )}
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
                              className={cn(
                                errors.lastName && 'border-red-500 ring-red-500'
                              )}
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
              <FormField
                control={form.control}
                name='location'
                render={() => {
                  return (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationInput
                          name='location'
                          register={form.register}
                          setValue={form.setValue}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              type='submit'
              className='w-full border-[#7F56D9] bg-[#573DF5] text-[#FFFFFF] shadow-sm shadow-[#1018280D]'
              disabled={!isValid || Object.keys(dirtyFields).length <= 0}
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
