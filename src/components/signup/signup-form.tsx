'use client';

import { FormContainer } from '../signin';
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
import { UserSignUpContext, UserSignUpContextType } from './signup-container';
import { Loading, useWalletSelector } from '@/components/common';
import {
  useCheckIsAccountAvailable,
  useLoginWithEmail,
  useSignUpAsync,
} from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, CircleCheck, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email format' }),
  accountId: z.string().min(1, { message: 'Account ID is required' }),
});

const SignUpForm = () => {
  const router = useRouter();
  const { setUserData, setStep } = useContext(
    UserSignUpContext
  ) as UserSignUpContextType;
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
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
  const formValues = form.watch();
  const { isValid, touchedFields, errors } = useFormState({
    control: form.control,
  });
  const { modal: nearModal, accounts, selector } = useWalletSelector();
  const { mutateAsync: loginWithEmail } = useLoginWithEmail();
  const { isPending: signUpPending, mutateAsync: signUpAsync } =
    useSignUpAsync();
  const {
    isPending: checkAccountPending,
    mutateAsync: checkIsAccountAvailable,
    isError: checkAccountError,
  } = useCheckIsAccountAvailable();

  const onSubmit = form.handleSubmit(async (values: z.infer<typeof schema>) => {
    setUserData((user) => ({ ...user, ...values }));
    await signUpAsync({
      ...values,
      userType: 'FREELANCER',
    });
    await loginWithEmail(values.email);

    setStep(1);
  });

  useEffect(() => {
    const storedData = localStorage.getItem('signupForm');
    if (storedData) {
      const { values, timestamp } = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000;
      if (currentTime - timestamp < fiveMinutes) {
        form.reset(values);
      } else {
        localStorage.removeItem('signupForm');
      }
    }
  }, [router, form.reset]);

  useEffect(() => {
    if (isValid) {
      const timestamp = new Date().getTime();
      const dataToStore = {
        values: formValues,
        timestamp: timestamp,
      };
      localStorage.setItem('signupForm', JSON.stringify(dataToStore));
    }
  }, [formValues, isValid]);

  useEffect(() => {
    if (accounts.length > 0) {
      form.setValue('accountId', accounts[0].accountId);
    }
  }, [accounts]);

  const handleWalletLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    nearModal.show();
  };

  const handleWalletSignout = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    try {
      const wallet = await selector.wallet();
      await wallet.signOut();
    } catch (err) {
      console.log('Failed to sign out');
      console.error(err);
    }
  };

  return (
    <FormContainer>
      <h1 className='text-2xl font-semibold'>Sign Up</h1>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col gap-4 p-2 min-h-[310px]'>
            <div className='flex flex-row gap-6'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => {
                  return (
                    <FormItem className='space-y-[6px]'>
                      <FormLabel className='text-sm text-[#344054]'>
                        First name
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
                        Last name
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
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => {
                return (
                  <FormItem className='w-full flex flex-col gap-[6px] space-y-0'>
                    <FormLabel className='m-0 p-0 text-sm text-[#344054]'>
                      Email
                    </FormLabel>
                    <FormControl className='m-0 p-0'>
                      <div className='relative w-full'>
                        <Input
                          {...form.register('email')}
                          placeholder='your@email.com'
                          {...field}
                          className={
                            !!errors.email
                              ? 'border-red-500 ring-red-500 m-0'
                              : 'm-0'
                          }
                        />
                        {touchedFields.email ? (
                          errors.email ? (
                            <CircleAlert className='h-4 w-4 text-[#D92D20] absolute right-4 top-3' />
                          ) : (
                            <CircleCheck className='h-4 w-4 text-[#2DD920] absolute right-4 top-3' />
                          )
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage className='m-0 p-0  text-sm' />
                  </FormItem>
                );
              }}
            />
            {/* <FormField
              control={form.control}
              name='accountId'
              render={({ field }) => {
                const handleChange = async (e: any) => {
                  field.onChange(e);
                  const value = e.target.value;
                  const available = await checkIsAccountAvailable(value);
                  setUsernameAvailable(available);
                };
                return (
                  <FormItem className='w-full flex flex-col gap-[6px] space-y-0'>
                    <FormLabel className='text-sm text-[#344054]'>
                      Account ID
                    </FormLabel>
                    <FormControl>
                      <div className='flex flex-row w-full'>
                        <div className='relative w-full'>
                          <Input
                            {...form.register('accountId')}
                            placeholder='user-name'
                            className={
                              !!errors.accountId
                                ? 'border-red-500 ring-red-500 rounded-l-md rounded-r-none'
                                : 'rounded-l-md rounded-r-none'
                            }
                            {...field}
                            onChange={(e) => handleChange(e)}
                          />
                          {checkAccountPending ? (
                            <Loader className='h-4 w-4 absolute right-4 top-3' />
                          ) : touchedFields.accountId ? (
                            checkAccountError ||
                            errors.accountId ||
                            !usernameAvailable ? (
                              <CircleAlert className='h-4 w-4 text-[#D92D20] absolute right-4 top-3' />
                            ) : (
                              <CircleCheck className='h-4 w-4 text-[#2DD920] absolute right-4 top-3' />
                            )
                          ) : null}
                        </div>
                        <div className='h-10 flex items-center justify-center rounded-l-none rounded-r-md border text-base px-4 py-[10px] text-[#344054] hover:cursor-default'>
                          .near
                        </div>
                      </div>
                    </FormControl>
                    {touchedFields.accountId ? (
                      !usernameAvailable ? (
                        <FormMessage className='text-[#D92D20] text-sm'>
                          {field.value}.near is taken, try something else
                        </FormMessage>
                      ) : (
                        <FormMessage className='text-[#2DD920] text-sm'>
                          Account ID is available
                        </FormMessage>
                      )
                    ) : (
                      <FormMessage className='text-[#475467] text-sm'>
                        Customize your own username
                      </FormMessage>
                    )}
                  </FormItem>
                );
              }}
            /> */}
            <FormField
              control={form.control}
              name='accountId'
              render={({ field }) => {
                return (
                  <FormItem className='w-full flex flex-col gap-[6px] space-y-0'>
                    <FormLabel className='text-sm text-[#344054]'>
                      NEAR Wallet
                    </FormLabel>
                    <FormControl>
                      <div className='flex flex-row w-full'>
                        <div className='relative w-full'>
                          <Input
                            {...form.register('accountId')}
                            placeholder='Your near account id'
                            className={
                              !!errors.accountId
                                ? 'border-red-500 ring-red-500 rounded-l-md rounded-r-none'
                                : 'rounded-l-md rounded-r-none'
                            }
                            {...field}
                            value={
                              accounts.length > 0 ? accounts[0].accountId : ''
                            }
                            readOnly
                          />
                          {checkAccountPending ? (
                            <Loader className='h-4 w-4 absolute right-4 top-3' />
                          ) : touchedFields.accountId ? (
                            checkAccountError ||
                            errors.accountId ||
                            !usernameAvailable ? (
                              <CircleAlert className='h-4 w-4 text-[#D92D20] absolute right-4 top-3' />
                            ) : (
                              <CircleCheck className='h-4 w-4 text-[#2DD920] absolute right-4 top-3' />
                            )
                          ) : null}
                        </div>
                        {/* <div className='h-10 flex items-center justify-center rounded-l-none rounded-r-md border text-base px-4 py-[10px] text-[#344054] hover:cursor-default'>
                          .near
                        </div> */}
                        {accounts.length > 0 ? (
                          <Button
                            className='ml-2 rounded-lg bg-sorbet px-4 py-1 text-sm text-white'
                            onClick={handleWalletSignout}
                          >
                            Disconnect Wallet
                          </Button>
                        ) : (
                          <Button
                            className='ml-2 rounded-lg bg-sorbet px-4 py-1 text-sm text-white'
                            onClick={handleWalletLogin}
                          >
                            Connect Wallet
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    {/* {touchedFields.accountId ? (
                      !usernameAvailable ? (
                        <FormMessage className='text-[#D92D20] text-sm'>
                          {field.value}.near is taken, try something else
                        </FormMessage>
                      ) : (
                        <FormMessage className='text-[#2DD920] text-sm'>
                          Account ID is available
                        </FormMessage>
                      )
                    ) : (
                      <FormMessage className='text-[#475467] text-sm'>
                        Customize your own username
                      </FormMessage>
                    )} */}
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            type='submit'
            // disabled={!isValid || !usernameAvailable}
            disabled={!isValid}
            className={'w-full bg-[#573DF5] border-[#7F56D9]'}
          >
            {signUpPending ? <Loader /> : 'Continue'}
          </Button>
        </form>
      </Form>
      <p className='text-[#3B3A40] text-xs leading-[18px] text-center'>
        Already have an account?{' '}
        <Link
          className='text-xs leading-[18px] text-[#6230EC] font-bold'
          href={'/signin'}
        >
          Sign in
        </Link>
      </p>
    </FormContainer>
  );
};

export { SignUpForm };
