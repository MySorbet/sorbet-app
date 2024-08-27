'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isPassKeyAvailable } from '@near-js/biometric-ed25519';
import { captureException } from '@sentry/react';
import { Wallet03 } from '@untitled-ui/icons-react';
import BN from 'bn.js';
import { randomBytes } from 'crypto';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { CircleAlert, CircleCheck, Loader } from 'lucide-react';
import * as near_api_js_1 from 'near-api-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { Loading } from '@/components/common';
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth, useGetUserByAccountId, useLoginWithEmail } from '@/hooks';
import { getFastAuthState } from '@/hooks/useFastAuthState';
import useFirebaseUser from '@/hooks/useFirebaseUser';
import { basePath, config } from '@/lib/config';
import { decodeIfTruthy, inIframe } from '@/utils/fastAuth';
import { checkFirestoreReady, firebaseAuth } from '@/utils/fastAuth/firebase';

import { FormContainer } from './form-container';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
});

interface CreateAccountParams {
  accountId: string | null;
  email: string;
  isRecovery: boolean;
  success_url?: string;
  failure_url?: string;
  public_key?: string;
  contract_id?: string;
  methodNames?: string;
}

export const handleCreateAccount = async ({
  accountId,
  email,
  isRecovery,
  success_url,
  failure_url,
  public_key,
  contract_id,
  methodNames,
}: CreateAccountParams) => {
  const searchParams = new URLSearchParams(
    Object.entries({
      ...(accountId ? { accountId } : {}),
      ...(isRecovery ? { isRecovery: 'true' } : {}),
      ...(success_url ? { success_url } : {}),
      ...(failure_url ? { failure_url } : {}),
      ...(public_key ? { public_key_lak: public_key } : {}),
      ...(contract_id ? { contract_id } : {}),
      ...(methodNames ? { methodNames } : {}),
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as Record<string, string>)
  );

  await sendSignInLinkToEmail(firebaseAuth, email, {
    url: encodeURI(
      `${config.fastAuthDomain}/auth-callback?${searchParams.toString()}`
    ),
    handleCodeInApp: true,
  });
  window.localStorage.setItem('emailForSignIn', email);
  return {
    accountId,
  };
};

/** Simple sign in form which calls out to fastauth */
export const SignIn = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
  });
  const { isValidating, isValid, touchedFields } = useFormState({
    control,
  });

  const router = useRouter();
  const { toast } = useToast();
  const [activeNearAccount, setActiveNearAccount] = useState<string | null>(
    null
  );
  const [accountNotFound, setAccountNotFound] = useState<boolean>(false);

  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  const { user, accessToken, loginWithWallet } = useAuth();
  const {
    modal: nearModal,
    selector,
    accountId,
    accounts,
  } = useWalletSelector();

  const { isPending: loginLoading, mutateAsync: loginWithEmail } =
    useLoginWithEmail();
  const { loading: firebaseUserLoading, user: firebaseUser } =
    useFirebaseUser();
  const [inFlight, setInFlight] = useState(false);

  const {
    isPending: isGetUserAccountLoading,
    mutateAsync: getUserByAccountId,
  } = useGetUserByAccountId();

  const handleAuthCallback = useCallback(async () => {
    setInFlight(true);
    const success_url = config.loginSuccessUrl;
    const public_key = near_api_js_1.KeyPair.fromRandom('ed25519')
      .getPublicKey()
      .toString();
    const searchParams = new URLSearchParams(window.location.search);
    const methodNames = decodeIfTruthy(searchParams.get('methodNames'));
    const contract_id = config.contractId;

    const isPasskeySupported = await isPassKeyAvailable();
    if (!public_key || !contract_id) {
      window.location.replace(
        success_url || window.location.origin + (basePath ? `/${basePath}` : '')
      );
      return;
    }
    const publicKeyFak = isPasskeySupported
      ? await window.fastAuthController.getPublicKey()
      : '';
    const existingDevice =
      isPasskeySupported && firebaseUser
        ? await window.firestoreController.getDeviceCollection(publicKeyFak)
        : null;
    const existingDeviceLakKey = existingDevice?.publicKeys?.filter(
      (key: any) => key !== publicKeyFak
    )[0];

    // @ts-expect-error Property 'accessToken' does not exist on type 'User'
    const oidcToken = firebaseUser?.accessToken;
    const recoveryPk =
      oidcToken &&
      (await window.fastAuthController
        .getUserCredential(oidcToken)
        .catch(() => false));
    const allKeys = [public_key, publicKeyFak].concat(recoveryPk || []);
    // if given lak key is already attached to webAuthN public key, no need to add it again
    const noNeedToAddKey = existingDeviceLakKey === public_key;

    if (noNeedToAddKey) {
      window.parent.postMessage(
        {
          type: 'method',
          method: 'query',
          id: 1234,
          params: {
            request_type: 'complete_authentication',
            publicKey: public_key,
            allKeys: allKeys.join(','),
            accountId: (window as any).fastAuthController.getAccountId(),
          },
        },
        '*'
      );
      if (!inIframe()) {
        const parsedUrl = new URL(
          success_url ||
            window.location.origin + (basePath ? `/${basePath}` : '')
        );
        parsedUrl.searchParams.set(
          'account_id',
          (window as any).fastAuthController.getAccountId()
        );
        parsedUrl.searchParams.set('public_key', public_key);
        parsedUrl.searchParams.set('all_keys', allKeys.join(','));
        window.location.replace(parsedUrl.href);
      }
      setInFlight(false);
      return;
    }

    window.fastAuthController
      .signAndSendAddKey({
        contractId: contract_id,
        methodNames,
        allowance: new BN(config.nearMaxAllowances ?? '0'),
        publicKey: public_key,
      })
      .then((res: any) => res && res.json())
      .then((res: any) => {
        const failure = res['Receipts Outcome'].find(
          // @ts-expect-error ts-7031 status is any
          ({ outcome: { status } }) =>
            Object.keys(status).some((k) => k === 'Failure')
        )?.outcome?.status?.Failure;
        if (failure) {
          return failure;
        }

        if (!firebaseUser) return null;

        // Add device
        window.firestoreController.updateUser({
          userUid: firebaseUser.uid,
          // User type is missing accessToken but it exists
          oidcToken,
        });

        // Since FAK is already added, we only add LAK
        return window.firestoreController
          .addDeviceCollection({
            fakPublicKey: null,
            lakPublicKey: public_key,
            gateway: success_url,
          })
          .catch((err: any) => {
            console.log('Failed to add device collection', err);
            throw new Error('Failed to add device collection');
          });
      })
      .then((failure: any) => {
        if (failure?.ActionError?.kind?.LackBalanceForState) {
          window.location.href = `/devices?${searchParams.toString()}`;
        } else {
          window.parent.postMessage(
            {
              type: 'method',
              method: 'query',
              id: 1234,
              params: {
                request_type: 'complete_authentication',
                publicKey: public_key,
                allKeys: allKeys.join(','),
                accountId: (window as any).fastAuthController.getAccountId(),
              },
            },
            '*'
          );
          if (!inIframe()) {
            const parsedUrl = new URL(
              success_url ||
                window.location.origin + (basePath ? `/${basePath}` : '')
            );
            parsedUrl.searchParams.set(
              'account_id',
              (window as any).fastAuthController.getAccountId()
            );
            parsedUrl.searchParams.set('public_key', public_key);
            parsedUrl.searchParams.set('all_keys', allKeys.join(','));
            window.location.replace(parsedUrl.href);
          }
        }
      })
      .catch((error: any) => {
        console.log('error', error);
        captureException(error);
        window.parent.postMessage(
          {
            type: 'AddDeviceError',
            message:
              typeof error?.message === 'string'
                ? error.message
                : 'Something went wrong',
          },
          '*'
        );
        toast({
          title: 'ERROR',
          description: error.message,
          variant: 'destructive',
        });
      })
      .finally(() => setInFlight(false));
  }, [firebaseUser]);

  const addDevice = useCallback(async (data: any) => {
    setInFlight(true);

    // if different user is logged in, sign out
    await firebaseAuth.signOut();

    const success_url = config.loginSuccessUrl;
    const failure_url = config.loginFailureUrl;
    const public_key = near_api_js_1.KeyPair.fromRandom('ed25519')
      .getPublicKey()
      .toString();
    const methodNames = '';
    const contract_id = config.contractId;

    try {
      await handleCreateAccount({
        accountId: null,
        email: data.email,
        isRecovery: true,
        success_url,
        failure_url,
        public_key,
        contract_id,
        methodNames,
      });

      const paramsObject = {
        email: data.email,
        isRecovery: 'true',
        ...(data.success_url ? { success_url } : {}),
        ...(data.failure_url ? { failure_url } : {}),
        ...(data.public_key ? { public_key_lak: public_key } : {}),
        ...(data.contract_id ? { contract_id } : {}),
        ...(data.methodNames ? { methodNames } : {}),
      };
      const newSearchParams = new URLSearchParams(paramsObject);

      window.location.href = `https://sorbet-fast-auth-c3tiwq6mya-uc.a.run.app/verify-email?${newSearchParams.toString()}`;
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        typeof error?.message === 'string'
          ? error.message
          : 'Something went wrong';
      window.parent.postMessage(
        {
          type: 'addDeviceError',
          message: errorMessage,
        },
        '*'
      );
      toast({
        title: 'ERROR',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setInFlight(false);
    }
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setIsProcessingAuth(true);
    try {
      const isPasskeySupported = await isPassKeyAvailable();
      if (!isPasskeySupported) {
        const authenticated = await getFastAuthState();
        const isFirestoreReady = await checkFirestoreReady();
        const firebaseAuthInvalid =
          authenticated === true &&
          !isPasskeySupported &&
          firebaseUser?.email !== data.email;
        const shouldUseCurrentUser =
          authenticated === true && !firebaseAuthInvalid && isFirestoreReady;
        if (shouldUseCurrentUser) {
          await loginWithEmail(data.email);
          alert('successfully logged in, now redirecting');
          await handleAuthCallback();
          return;
        }
      }

      await addDevice({ email: data.email });
    } catch (e: any) {
      console.error('Error occurred during form submission:', e);
      // Display error to the user

      toast({
        title: 'ERROR',
        description: 'An error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingAuth(false);
    }
  });

  useEffect(() => {
    const handleRedirectLogin = async () => {
      const urlHash = window.location.href;
      if (urlHash) {
        const params = new URLSearchParams(urlHash.split('?')[1]);
        const accountId = params.get('account_id');
        const publicKey = params.get('public_key');

        if (accountId && publicKey) {
          setLoading(true);
          const email = localStorage.getItem('emailForSignIn');
          if (email) {
            setLoading(true);
            const response = await loginWithEmail(email);
            if (response.status === 'success') {
              router?.push('/');
            } else {
              toast({
                title: 'Failed to login',
                description: response.message,
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: 'Error logging in',
              description:
                'There was a problem receiving your email address from NEAR. Please try again',
            });
            setLoading(false);
          }
        }
      }
    };

    handleRedirectLogin();
  }, [router]);

  useEffect(() => {
    if (user && accessToken) {
      router.push('/');
    }
  }, [user, router]);

  // Check if the wallet selector has an account and check if there is a sorbet account for them
  // useEffect(() => {
  //   const checkNearConnection = async () => {
  //     console.log({ accounts, accountId });
  //     if (accounts.length > 0) {
  //       const activeAccount = accountId;
  //       setActiveNearAccount(activeAccount);

  //       if (activeAccount) {
  //         const response = await getUserByAccountId(activeAccount);
  //         if (response && response.data === 'failed') {
  //           setAccountNotFound(true);
  //           await handleSignOut();
  //         }
  //       }
  //     }
  //   };

  //   checkNearConnection();
  // }, [selector, accountId]);

  // Check if the wallet selector has an account and log into sorbet with it?
  useEffect(() => {
    const handleWalletLogin = async () => {
      const urlHash = window.location.hash;
      if (urlHash) {
        const params = new URLSearchParams(urlHash.substring(1));
        const accountId = params.get('accountId');
        const signature = params.get('signature');
        const publicKey = params.get('publicKey');

        if (accountId && signature && publicKey) {
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

  const handleWalletLogin = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const challenge = randomBytes(32);
    const message = 'Login with Sorbet';
    await nearModal.show();

    if (accounts.length > 0) {
      const wallet = await selector.wallet();
      if (wallet) {
        const recipient = await wallet.getAccounts();
        if (recipient.length > 0) {
          await wallet.signMessage({
            message,
            recipient: recipient[0].accountId,
            nonce: challenge,
            callbackUrl: '',
          });
        } else {
          toast({
            title: 'No wallet accounts found',
            description:
              'Please make sure your wallet has accounts and is connected.',
            variant: 'destructive',
          });
        }
      }
    }
  };

  return (
    <FormContainer>
      {isLoading && <Loading />}
      <h1 className='text-2xl font-semibold'>Sign In</h1>
      <form
        onSubmit={onSubmit}
        id='signin-form'
        className='flex flex-1 flex-col justify-between gap-4 px-0 py-2'
      >
        <div className='flex h-28 flex-col gap-[6px] '>
          <Label htmlFor='email'>Email</Label>
          <div className='relative'>
            <Input
              className={
                !isValid && touchedFields.email
                  ? 'border-red-500 ring-red-500'
                  : ''
              }
              {...register('email', {
                required: 'Please enter a valid email address',
              })}
            />
            {isValidating && (
              <Loader className='absolute right-4  top-3 h-4 w-4' />
            )}
            {touchedFields.email ? (
              isValid ? (
                <CircleCheck className='absolute right-4 top-3 h-4 w-4 text-[#079455]' />
              ) : (
                <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
              )
            ) : null}
          </div>
          {!isValid && touchedFields.email && (
            <p className='text-sm text-red-500'>Invalid email format</p>
          )}
        </div>
        <div className='flex h-full flex-col justify-between'>
          <div
            id='button-container'
            className='flex flex-col items-center gap-3'
          >
            <Button
              className='w-full border-[#7F56D9] bg-[#573DF5] text-base'
              disabled={!isValid}
              type='submit'
            >
              {loginLoading ? <Loader /> : 'Continue'}
            </Button>
            <p className='text-sm font-medium'>Or</p>
            <Button
              className='group w-full gap-[6px] border border-[#D6BBFB] bg-[#FFFFFF] p-[10px] text-base font-semibold text-[#573DF5] hover:bg-[#573DF5] hover:text-white'
              onClick={handleWalletLogin}
            >
              <Wallet03 className='size-5' />
              Connect Wallet
            </Button>
          </div>
          <p className='text-center text-xs leading-[18px] text-[#3B3A40]'>
            Don't have an account?{' '}
            <Link
              className='text-xs font-bold leading-[18px] text-[#6230EC]'
              href='/signup'
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </FormContainer>
  );
};
