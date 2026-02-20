'use client';

import {
  useLinkAccount,
  usePrivy,
  useUpdateAccount,
} from '@privy-io/react-auth';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUpdateUser } from '@/hooks/profile/use-update-user';
import { useAuth } from '@/hooks/use-auth';

/** POC for managing linked accounts. Not prod ready */
export const AccountLinking = () => {
  const { user, unlinkGoogle } = usePrivy();
  const { user: sorbetUser } = useAuth();

  const { linkGoogle } = useLinkAccount({
    onSuccess: (linkedAccount) => {
      console.log('Linked account to user ', linkedAccount);
      toast.success('Linked account to user ');
      // todo: do we need to update the sorbet user or knock?
      // todo: What do we do when google is the same as the email?
      // todo: during signup, if it is a google signup, we still need to set the sorbet email
    },
    onError: (error) => {
      console.error('Failed to link account with error ', error);
      toast.error('Failed to link account');
    },
  });

  const { mutateAsync: updateUser } = useUpdateUser();

  const { updateEmail } = useUpdateAccount({
    onSuccess: ({ user }) => {
      // Here we update the sorbet db with the new user email. Knock will also be updated
      const email = user.email?.address;
      if (email && sorbetUser?.id) {
        updateUser({
          id: sorbetUser.id,
          email,
        });
        toast.success('Updated email');
      }
    },
    onError: (error, details) => {
      console.log(error, details);
      toast.error('Failed to update email');
    },
  });

  const hasGoogle = Boolean(user?.google?.email);

  return (
    <div className='flex w-full flex-col gap-5'>
      <h2 className='text-xl font-semibold'>Accounts</h2>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <GoogleIcon /> Google
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasGoogle ? (
            <p>{user?.google?.email}</p>
          ) : (
            <p>No Google account linked</p>
          )}
        </CardContent>
        <CardFooter>
          {hasGoogle ? (
            <Button
              variant='destructive'
              onClick={() => {
                unlinkGoogle(user?.google?.subject ?? '');
              }}
            >
              Unlink Google
            </Button>
          ) : (
            <Button variant='sorbet' onClick={linkGoogle}>
              Link Google
            </Button>
          )}
        </CardFooter>
      </Card>
      {user?.email && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Mail /> Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You can use this email to receive OTPs to login. This is also the
              address where you will receive notifications from Sorbet.
            </CardDescription>

            <p>{user.email?.address}</p>
          </CardContent>
          <CardFooter>
            <Button variant='sorbet' onClick={updateEmail}>
              Update Email
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

/**
 * @see https://developers.google.com/identity/branding-guidelines
 */
const GoogleIcon = () => {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 48 48'
      width={20}
      height={20}
      xmlnsXlink='http://www.w3.org/1999/xlink'
      style={{ display: 'block' }}
    >
      <path
        fill='#EA4335'
        d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
      ></path>
      <path
        fill='#4285F4'
        d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
      ></path>
      <path
        fill='#FBBC05'
        d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
      ></path>
      <path
        fill='#34A853'
        d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
      ></path>
      <path fill='none' d='M0 0h48v48H0z'></path>
    </svg>
  );
};
