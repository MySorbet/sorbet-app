'use client';

import './signin.css';
import { signInWithWallet } from '@/api/auth';
import { Loading, PageTitle } from '@/components/common';
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { randomBytes } from 'crypto';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Signin = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { user, loginWithEmail, accessToken, loginWithWallet, checkAuth } =
    useAuth();
  const { modal: nearModal, selector, accountId } = useWalletSelector();
  const router = useRouter();
  const { toast } = useToast();
  const [activeNearAccount, setActiveNearAccount] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user && accessToken) {
      router.push('/');
    }
  }, [user, accessToken, router]);

  useEffect(() => {
    const checkNearConnection = async () => {
      const isConnected = selector.isSignedIn();
      if (isConnected) {
        const activeAccount = accountId;
        setActiveNearAccount(activeAccount);
      }
    };

    checkNearConnection();
  }, [selector, accountId]);

  useEffect(() => {
    const handleWalletLogin = async () => {
      const urlHash = window.location.hash;
      if (urlHash) {
        const params = new URLSearchParams(urlHash.substring(1));
        const accountId = params.get('accountId');
        const signature = params.get('signature');
        const publicKey = params.get('publicKey');

        if (accountId && signature && publicKey) {
          console.log('Account ID:', accountId);
          console.log('Signature:', signature);
          console.log('Public Key:', publicKey);

          const response = await loginWithWallet(accountId);
          if (response.status === 'success') {
            setLoading(false);
            router?.push('/');
          } else {
            toast({
              title: 'Failed to login',
              description: response.message,
              variant: 'destructive',
            });
            setLoading(false);
          }
        }
      }
    };

    handleWalletLogin();
  }, [router]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);

    const response = await loginWithEmail(data.email);
    if (response.status === 'success') {
      setLoading(false);
      router?.push('/');
    } else {
      toast({
        title: 'Failed to login',
        description: response.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  });

  const handleWalletLogin = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const challenge = randomBytes(32);
    const message = 'Login with Sorbet';
    await nearModal.show();
    const wallet = await selector.wallet();
    const recipient = await wallet.getAccounts();
    await wallet.signMessage({
      message,
      recipient: recipient[0].accountId,
      nonce: challenge,
      callbackUrl: '',
    });
  };

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-[#F2F2F2] bg-no-repeat'>
      {isLoading && <Loading />}
      <div className='w-[500px] items-center justify-center rounded-2xl bg-[#FFFFFF] p-6 px-6 text-black max-sm:w-[300px]'>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col items-start gap-6 px-6 pb-6'>
            <h1 className='text-[32px]'>Sign in</h1>
            <div className='item w-full'>
              <Button
                className='h-11 gap-1 self-stretch rounded-lg bg-sorbet px-2 py-1 text-sm text-white'
                onClick={handleWalletLogin}
              >
                Login with Wallet
              </Button>
            </div>
            <div className='inline-block w-full text-base text-center'>
              Already have an account?
              <span
                className='text-sorbet cursor-pointer pl-1 font-semibold'
                onClick={() => router.push('/signup')}
              >
                Sign up
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
