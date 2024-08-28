'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loading02 } from '@untitled-ui/icons-react';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { createOffer } from '@/api/gigs';
import { getUserByHandle } from '@/api/user';
import { signUpWithPrivyId } from '@/api/auth';
import {
  ProjectFormValues,
  ProjectOfferDialog,
} from '@/app/[username]/project-offer-dialog';
import { UserSocialPreview } from '@/components/common';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { User } from '@/types';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const { user, loginWithPrivyId } = useAuth();
  const router = useRouter();
  const { ready, user: privy_user, logout } = usePrivy();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { login } = useLogin({
    onComplete: async (user, isNewUser, wasAlreadyAuthenticated) => {
      console.log('wasAlreadyAuthenticated: ', wasAlreadyAuthenticated);

      // Fetch user from sorbet
      setLoading(true);
      const loginResult = await loginWithPrivyId(user.id);
      if (isNewUser) {
        console.log(
          'This is a new user. Creating a sorbet user and redirecting to signup'
        );
        const newUser = await signUpWithPrivyId({ id: user.id });
        // TODO: Maybe we should give them a temp handle so that they can see their profile in case handle update fails?
        dispatch(updateUserData(newUser.data as unknown as User));
        console.log(newUser.data);
        router.replace('/signup');
        return;
      }
      // If the login fails, log out and show an error
      if (loginResult.status === 'failed') {
        await logout();
        setLoading(false);
        toast({
          title: 'Error',
          description: `Error logging in: ${loginResult.error?.message}`,
          variant: 'destructive',
        });
        return;
      }
      setLoading(false);
      // If you get here, the login was successful and you have a sorbet user. Route to their profile
      console.log(loginResult);
    },
    onError: (error) => {
      console.log('error', error);
      setLoading(false);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  useEffect(() => {
    // Simulate an async operation that updates the status after some time
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 10000);
    };

    fetchData();
  }, []);
  // useEffect(() => {
  //   if (privy_user) {
  //     console.log('privy_user1', privy_user);
  //     login();
  //     setLoading(false);
  //   }
  // }, [privy_user]);

  // console.log('login', login);

  // Mutation to be called when an offer is sent from the logged in user to the freelancer
  const mutation = useMutation({
    mutationFn: (projectFormValues: ProjectFormValues) => {
      console.log('user', user);
      if (!user) throw new Error('User not found');
      return createOffer({
        projectName: projectFormValues.projectName,
        description: projectFormValues.description,
        projectStart: projectFormValues.projectStarting,
        budget: projectFormValues.budget,
        // TODO: This will be broken until createOffer uses their handle
        // clientUsername: withSuffix(user.accountId),
        // freelancerUsername: withSuffix(params.username),
        clientUsername: user.handle ?? '',
        // clientUsername: user.privyId ?? '',
        freelancerUsername: params.username,
      });
    },
    onError: (err) => {
      if (err?.message === 'User not found') {
        toast({
          title: 'Error',
          description: 'You must be logged in to send an offer',
        });
        return;
      }
      toast({
        title: 'Something went wrong',
        description: 'We were unable to send your offer. Please try again',
      });
    },
  });

  // Query to get the freelancer's profile via the handle in the url
  const {
    isPending,
    isError,
    data: freelancerResponse,
  } = useQuery({
    queryKey: ['freelancer'],
    queryFn: () => getUserByHandle(`${params.username}`),
  });

  // Alias some vars for easy access in JSX
  const freelancer = freelancerResponse?.data;
  console.log('Freelancer: ', user);
  const isMyProfile = params.username === user?.handle;
  const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  return (
    <>
      {isLoading ? (
        <div className='flex h-screen w-full items-center justify-center'>
          <Loading02 className='animate t h-16 w-16 animate-spin' />
        </div>
      ) : (
        <>
          <Header />
          {!isPending && freelancer && (
            <>
              <Profile
                user={freelancer}
                canEdit={isMyProfile}
                onHireMeClick={() => setOfferDialogOpen(true)}
                disableHireMe={isMyProfile}
              />
              <UserSocialPreview title={freelancerFullName} />
              <ProjectOfferDialog
                isOpen={isOfferDialogOpen}
                onClose={(open) => setOfferDialogOpen(open)}
                onSubmit={mutation.mutate}
                name={freelancerFullName}
                formSubmitted={mutation.isSuccess}
              />
            </>
          )}
        </>
      )}
      {isError && <ClaimYourProfile username={params.username} />}
    </>
  );
};

export default ProfilePage;

/** Local component to display a "Claim your profile CTA when visiting a profile that does not exist" */
const ClaimYourProfile = (props: { username: string }) => {
  return (
    <div className='align-center container flex size-full flex-col items-center justify-center gap-10'>
      <div>
        <img src='/svg/logo.svg' alt='logo' width={100} height={100} />
      </div>
      <div>
        <div className='border-1 flex justify-center rounded-xl border border-gray-200 bg-gray-100 p-6 text-4xl'>
          <span className='text-gray-500'>mysorbet.xyz/</span>
          <span>{props.username}</span>
        </div>
        <div className='mt-4 text-center'>
          The handle is available for you to build your internet presence today!
        </div>
      </div>
      <Button size='lg' className='bg-sorbet text-xl'>
        Claim Handle Today
      </Button>
    </div>
  );
};
