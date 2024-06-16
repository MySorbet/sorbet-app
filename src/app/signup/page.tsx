'use client';

import './signup.css';
import { signUpAsync } from '@/api/auth';
import { Loading, PageTitle, useWalletSelector } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';
import { currentNetwork } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, FormEvent } from 'react';
import { useForm } from 'react-hook-form';

const Signup = () => {
  const [isAccountAvailable, setIsAccountAvailable] = useState<boolean | null>(
    null
  );
  const [isAccountValid, setIsAccountValid] = useState<boolean | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const { user, accessToken, loginWithEmail } = useAuth();
  const { modal: nearModal, accounts } = useWalletSelector();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    clearErrors,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      userType: 'FREELANCER',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
    },
    mode: 'onChange',
  });

  const formValues = watch();
  const { toast } = useToast();

  const checkIsAccountAvailable = useCallback(
    async (desiredUsername: string) => {
      setIsAccountAvailable(null);
      try {
        if (!desiredUsername) return;

        const response = await fetch(currentNetwork.nodeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'query',
            params: {
              request_type: 'view_account',
              finality: 'final',
              account_id: `${desiredUsername}.${currentNetwork.fastAuth.accountIdSuffix}`,
            },
          }),
        });
        const data = await response.json();
        if (data?.error?.cause?.name == 'UNKNOWN_ACCOUNT') {
          return setIsAccountAvailable(true);
        }

        if (data?.result?.code_hash) {
          return setIsAccountAvailable(false);
        }
      } catch (error: any) {
        setIsAccountAvailable(false);
      }
    },
    []
  );

  const handleWalletLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    nearModal.show();
  };

  useEffect(() => {
    if (accounts.length > 0) {
      setValue('username', accounts[0].accountId);
    }
  }, [accounts, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (!data?.username || !data.email || !data.firstName || !data.lastName)
      return;

    const userType = getValues('userType');

    const response = await signUpAsync({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      accountId: `${data.username}`,
      userType: userType,
    });

    if (response.status === 'success') {
      const loginResponse = await loginWithEmail(data.email);
      if (loginResponse.status === 'success') {
        setLoading(false);
        router.push('/');
      } else {
        toast({
          title: 'Unable to login',
          description:
            'Your account was created but something went wrong when logging you in.',
        });
        setLoading(false);
      }
    } else {
      toast({
        title: 'Unable to create user account',
        description: response.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  });

  useEffect(() => {
    setIsAccountAvailable(null);
    const delayDebounce = setTimeout(() => {
      clearErrors('username');
      if (!formValues?.username?.length) {
        setIsAccountValid(null);
        return;
      }

      const isValid = /^([a-z\d]+[-_])*[a-z\d]+$/.test(formValues?.username);
      setIsAccountValid(isValid);
      if (!isValid) return;

      checkIsAccountAvailable(formValues?.username);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [checkIsAccountAvailable, clearErrors, formValues?.username]);

  let accountStatusMessage = '';
  let accountStatusState = '';
  if (!formValues?.username?.length) {
    accountStatusMessage = 'Use a suggested ID or customize your own.';
  } else if (!isAccountValid) {
    accountStatusMessage =
      'Accounts must be lowercase and may contain - or _, but they may not begin or end with a special character or have two consecutive special characters.';
    accountStatusState = 'text-red-600';
  } else if (isAccountAvailable === null) {
    accountStatusMessage = 'Checking availability...';
  } else if (isAccountAvailable) {
    accountStatusMessage = `${formValues?.username}.${currentNetwork.fastAuth.accountIdSuffix} is available!`;
    accountStatusState = 'text-green-600';
  } else {
    accountStatusMessage = `${formValues?.username}.${currentNetwork.fastAuth.accountIdSuffix} is taken, try something else.`;
    accountStatusState = 'text-red-600';
  }

  const registerForm = (
    <form onSubmit={onSubmit}>
      <h1 className='text-[32px] mb-4 text-center'>Sign up</h1>

      <div className='row my-4 flex justify-left md:justify-center'>
        <RadioGroup
          defaultValue='FREELANCER'
          className='flex flex-col gap-3 md:flex-row md:gap-6'
          onChange={(event) =>
            setValue('userType', (event.target as HTMLInputElement).value)
          }
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='FREELANCER' id='r1' />
            <Label htmlFor='r1' className='text-[#595B5A]'>
              I'm a freelancer
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='CLIENT' id='r2' />
            <Label htmlFor='r2' className='text-[#595B5A]'>
              I'm a client
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className='row mb-4'>
        <div className='item'>
          <label className='text-[#595B5A]'>First name</label>
          <Input
            {...register('firstName', {
              required: 'Please enter your first name',
            })}
            className='w-full rounded-lg'
            placeholder='First Name'
            disabled={isLoading}
          />
          {typeof errors.firstName?.message === 'string' && (
            <p className='text-sm text-red-500'>{errors.firstName?.message}</p>
          )}
        </div>
        <div className='item'>
          <label className='text-[#595B5A]'>Last name</label>
          <Input
            {...register('lastName', {
              required: 'Please enter your last name',
            })}
            className='w-full rounded-lg'
            placeholder='Last Name'
            disabled={isLoading}
          />
          {typeof errors.lastName?.message === 'string' && (
            <p className='text-sm text-red-500'>{errors.lastName?.message}</p>
          )}
        </div>
      </div>
      <div className='item w-full mb-4'>
        <label className='text-[#595B5A]'>Email</label>
        <Input
          {...register('email', {
            required: 'Please enter your email address',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please enter a valid email address',
            },
          })}
          className='w-full rounded-lg'
          placeholder='your@email.com'
          disabled={isLoading}
        />
        {typeof errors.email?.message === 'string' && (
          <p className='text-sm text-red-500'>{errors.email?.message}</p>
        )}
      </div>
      {/* <div className='item w-full mb-2'>
        <label className='text-[#595B5A]'>Account ID</label>
        <Input
          {...register('username', {
            required: 'Please enter a valid account ID',
            pattern: {
              value: /^([a-z\d]+[-_])*[a-z\d]+$/,
              message: 'Please enter a valid account ID',
            },
          })}
          className='w-full rounded-lg'
          placeholder='Account ID'
          disabled={isLoading}
        />
        {typeof errors.username?.message === 'string' && (
          <p className='text-sm text-red-500'>{errors.username?.message}</p>
        )}
        */}
      {/* <p className={`subText mb-4 text-sm text-center`}>
        <span className={accountStatusState || ''}>{accountStatusMessage}</span>
      </p> */}

      <div className='item w-full mb-2'>
        <label className='text-[#595B5A]'>Connect wallet</label>
        <div className='flex w-full items-center'>
          <Input
            className='flex-1 rounded-lg'
            placeholder='Enter wallet address'
            value={accounts.length > 0 ? accounts[0].accountId : ''}
            readOnly
          />
          <Button
            className='ml-2 rounded-lg bg-sorbet px-4 py-1 text-sm text-white'
            onClick={handleWalletLogin}
            disabled={accounts.length > 0}
          >
            Connect Wallet
          </Button>
        </div>
      </div>

      <div className='item w-full mt-4'>
        <Button
          className='bg-sorbet h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
          type='submit'
          disabled={isLoading || !isValid}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </Button>
      </div>
      <div className='inline-block w-full text-base mt-4 text-center'>
        Already have an account?
        <span
          className='text-sorbet cursor-pointer pl-1 font-semibold'
          onClick={() => router.push('/signin')}
        >
          Sign in
        </span>
      </div>
    </form>
  );

  const alreadySignedUp = (
    <div className='text-center w-full'>
      <h1 className='text-[32px] mb-4 text-center'>Check your inbox</h1>
      <p>
        You will receive an email shortly with a link to activate your account.
      </p>
      <p
        className='text-primary-default cursor-pointer font-semibold mt-4'
        onClick={() => router.push('/signin')}
      >
        Back to sign in
      </p>
    </div>
  );

  if (isLoading) {
    return <Loading />;
  } else {
    if (!user && !accessToken) {
      return (
        <>
          <PageTitle title='Create your account' />
          <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
            <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 text-black max-sm:w-[300px]'>
              <div className='flex flex-col items-start gap-6 px-6 pb-6'>
                {signedUp ? alreadySignedUp : registerForm}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <Loading />;
    }
  }
};

export default Signup;
