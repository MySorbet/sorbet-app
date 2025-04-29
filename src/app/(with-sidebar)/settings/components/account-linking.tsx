'use client';

import {
  useLinkAccount,
  usePrivy,
  useUpdateAccount,
} from '@privy-io/react-auth';
import { UserPill } from '@privy-io/react-auth/ui';
import { Settings } from 'lucide-react';
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
    onSuccess: (linkedAccount) => {
      // Here we update the sorbet db with the new user email. Knock will also be updated
      const email = linkedAccount.email?.address;
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
    <div className='relative flex w-full flex-col gap-5'>
      <h2 className='text-xl font-semibold'>Accounts</h2>
      <div className='absolute right-0 top-0 w-fit'>
        <UserPill size={16} label={<Settings className='size-4' />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Google</CardTitle>
        </CardHeader>
        <CardContent>{hasGoogle && <p>{user?.google?.email}</p>}</CardContent>
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
            <CardTitle>Email</CardTitle>
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
