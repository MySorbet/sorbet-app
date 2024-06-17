'use client';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, CircleCheck, Loader } from 'lucide-react';
import Link from 'next/link';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  accountId: z.string().min(1, { message: 'Account ID is required' }),
});

const SignUpForm = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      accountId: '',
    },
    mode: 'all',
  });
  const { isValidating, isValid, touchedFields, errors } = useFormState({
    control: form.control,
  });

  const onSubmit = form.handleSubmit(async (values: z.infer<typeof schema>) => {
    console.log(values);
  });

  console.log('Form errors', errors);

  return (
    <div
      style={{
        boxShadow: '0px 20px 60px 0px #20202026',
      }}
      className='bg-[#F9F7FF] w-[400px] p-6 rounded-3xl flex flex-col gap-8'
    >
      <h1 className='text-2xl font-semibold'>Sign Up</h1>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => {
              console.log('Field', field);
              return (
                <FormItem>
                  <FormLabel>First name</FormLabel>
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
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type='submit'>Continue</Button>
        </form>
      </Form>
      <p className='text-[#3B3A40] text-xs leading-[18px] text-center'>
        Don't have an account?{' '}
        <Link
          className='text-xs leading-[18px] text-[#6230EC] font-bold'
          href={'/signin'}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export { SignUpForm };
