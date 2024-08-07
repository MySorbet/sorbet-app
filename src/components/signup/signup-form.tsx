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
import { useWalletSelector } from '@/components/common';
import { handleCreateAccount } from '@/components/signin/signin-form';
import { useToast } from '@/components/ui/use-toast';
import {
  useCheckIsAccountAvailable,
  useLoginWithEmail,
  useSignUp,
} from '@/hooks';
import { config, network } from '@/lib/config';
import {
  accountAddressPatternNoSubAccount,
  getEmailId,
} from '@/utils/fastAuth/form-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlert, CircleCheck, Loader } from 'lucide-react';
import * as near_api_js_1 from 'near-api-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

const checkIsAccountAvailable = async (
  desiredUsername: string
): Promise<boolean> => {
  try {
    const response = await fetch(network.nodeUrl, {
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
          account_id: `${desiredUsername}.${network.fastAuth.accountIdSuffix}`,
        },
      }),
    });
    const data = await response.json();
    if (data?.error?.cause?.name === 'UNKNOWN_ACCOUNT') {
      return true;
    }

    if (data?.result?.code_hash) {
      return false;
    }

    return false;
  } catch (error: any) {
    const { toast } = useToast();

    toast({
      title: 'ERROR',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }
};

const schema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  accountId: z
    .string()
    .min(1, { message: 'Account ID is required' })
    .regex(
      accountAddressPatternNoSubAccount,
      'Accounts must be lowercase and may contain - or _, but they may not begin or end with a special character or have two consecutive special characters.'
    )
    .refine(
      async (accountId) => {
        const isAvailable = await checkIsAccountAvailable(accountId);
        return isAvailable;
      },
      (accountId) => ({
        message: `${accountId}.${network.fastAuth.accountIdSuffix} is taken, try something else.`,
        path: ['accountId'],
      })
    ),
});

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserData, setStep } = useContext(
    UserSignUpContext
  ) as UserSignUpContextType;
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      accountId: '',
    },
    mode: 'all',
  });
  const formValues = form.watch();
  const formsEmail = form.watch('email');
  const formsUsername = form.watch('accountId');

  const { isValid, touchedFields, errors } = useFormState({
    control: form.control,
  });
  const { modal: nearModal, accounts, selector } = useWalletSelector();
  const { mutateAsync: loginWithEmail } = useLoginWithEmail();
  const { isPending: signUpPending, mutateAsync: signUp } = useSignUp();
  const {
    isPending: checkAccountPending,
    mutateAsync: checkIsAccountAvailable,
    isError: checkAccountError,
  } = useCheckIsAccountAvailable();
  const [inFlight, setInFlight] = useState(false);
  const { toast } = useToast();

  const createAccount = useCallback(
    async (data: { email: string; username: string }) => {
      setInFlight(true);
      const success_url = config.signUpSuccessUrl;
      const failure_url = config.signUpFailureUrl;
      const public_key = near_api_js_1.KeyPair.fromRandom('ed25519')
        .getPublicKey()
        .toString();
      const methodNames = '';
      const contract_id = config.contractId;
      try {
        const fullAccountId = `${data.username}.${network.fastAuth.accountIdSuffix}`;
        const { accountId } = await handleCreateAccount({
          accountId: fullAccountId,
          email: data.email,
          isRecovery: false,
          success_url,
          failure_url,
          public_key,
          contract_id,
          methodNames,
        });

        const searchParameters = {
          accountId,
          email: data.email,
          isRecovery: 'false',
          success_url: success_url || '',
          failure_url: failure_url || '',
          public_key_lak: public_key || '',
          contract_id: contract_id || '',
          methodNames: methodNames || '',
        };

        const newSearchParams = new URLSearchParams(
          Object.entries(searchParameters)
            .filter(([_, v]) => v !== null)
            .map(([k, v]) => [k, v as string])
        );

        window.parent.postMessage(
          {
            type: 'method',
            method: 'query',
            id: 1234,
            params: {
              request_type: 'complete_authentication',
            },
          },
          '*'
        );
        window.open(
          `${config.fastAuthDomain}/verify-email?${newSearchParams.toString()}`,
          '_parent'
        );
      } catch (error: any) {
        console.log('error', error);

        window.parent.postMessage(
          {
            type: 'CreateAccountError',
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
      } finally {
        setInFlight(false);
      }
    },
    []
  );

  // Effect to read stored local storage data and sync the form
  // TODO: Maybe this is no longer needed
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

  // Effect to persist form data in local storage
  // TODO: Maybe this is no longer needed
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

  // Effect to sync form accountId with first part of email
  useEffect(() => {
    console.log({ formsEmail });
    if (formsEmail?.split('@').length > 1) {
      form.setValue('accountId', getEmailId(formsEmail), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setUsernameAvailable(true);
    }
    // Should only trigger when email changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formsEmail, form.setValue]);

  // If the signup page is visited, and search params contain account_id
  // a fastauth account has been created and we are ready to
  // create a user in the sorbet db and move through the rest of the steps to update their info
  useEffect(() => {
    (async () => {
      const accountId = searchParams.get('account_id');
      if (accountId) {
        setStep(1);
        // Fastauth user created.
        const email = localStorage.getItem('emailForSignIn');
        if (email) {
          console.log('creating sorbet user');
          // Creates the user in sorbet db and then logs them in in (gets and stores jwt)
          await signUp({
            email,
            accountId,
          });
          await loginWithEmail(email);

          // TODO: If these fail, we probably want to delete the fastauth user
        } else {
          console.error(
            'Tried to sign up user to sorbet, but no email in localstorage'
          );
        }
      }
    })();
  }, [searchParams]);

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
        <form>
          <div className='flex flex-col gap-4 p-2 min-h-[310px]'>
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
                            suffix={
                              config.networkId == 'testnet'
                                ? '.testnet'
                                : '.mainnet'
                            }
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
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            type='button'
            onClick={() => {
              // @Humza added this code-this logic is wrong, we have to register user name and mail info on signup step1 page after successful creating wallet account.
              // handleAccountCreate({
              //   email: formsEmail,
              //   accountId: formsUsername,
              //   firstName: 'John',
              //   lastName: 'Doe',
              // });

              // Original code - this logic is fine.
              createAccount({
                email: formsEmail,
                username: formsUsername,
              });
            }}
            // disabled={errors.accountId != null || !formsEmail}
            disabled={!isValid || !usernameAvailable}
            // disabled={!isValid}
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
