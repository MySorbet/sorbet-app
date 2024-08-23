'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { createOffer } from '@/api/gigs';
import { getUserByAccountId } from '@/api/user';
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
import { config } from '@/lib/config';
import { User } from '@/types';
import { withSuffix } from '@/utils/user';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mutation to be called when an offer is sent from the logged in user to the freelancer
  const mutation = useMutation({
    mutationFn: (projectFormValues: ProjectFormValues) => {
      if (!user) throw new Error('User not found');
      return createOffer({
        projectName: projectFormValues.projectName,
        description: projectFormValues.description,
        projectStart: projectFormValues.projectStarting,
        budget: projectFormValues.budget,
        clientUsername: withSuffix(user.accountId),
        freelancerUsername: withSuffix(params.username),
      });
    },
    onError: () => {
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
    queryFn: () => getUserByAccountId(`${params.username}.${config.networkId}`),
  });

  // Alias some vars for easy access in JSX
  const freelancer = freelancerResponse?.data as User;
  const disableHireMe = params.username === user?.accountId.split('.')[0];
  const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  return (
    <>
      {!isError && (
        <>
          <Header />
          {!isPending && freelancer && (
            <>
              <Profile
                user={freelancer}
                canEdit={false}
                onHireMeClick={() => setOfferDialogOpen(true)}
                disableHireMe={disableHireMe}
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
<<<<<<< HEAD
    <div className='align-center container flex size-full flex-col items-center justify-center gap-10'>
=======
    <div className='align-center container mt-40 flex size-full flex-col items-center justify-center gap-10'>
>>>>>>> b54dc85 (Feature: adds pulse to CTA. Definitely not permanent, just playing around with some stuff until the design is created)
      <div>
        <img src='/svg/logo.svg' alt='logo' width={100} height={100} />
      </div>
      <div>
        <div className='border-1 flex justify-center rounded-xl border border-gray-200 bg-gray-100 p-6 text-4xl'>
          <span className='text-gray-500'>mysorbet.xyz/</span>
          <span>{props.username}</span>
        </div>
<<<<<<< HEAD
        <div className='mt-4 text-center'>
=======
        <div className='mt-4 text-center text-2xl'>
>>>>>>> b54dc85 (Feature: adds pulse to CTA. Definitely not permanent, just playing around with some stuff until the design is created)
          The handle is available for you to build your internet presence today!
        </div>
      </div>
<<<<<<< HEAD
      <Button size='lg' className='bg-sorbet text-xl'>
        Claim Handle Today
=======
      <Button
        size='lg'
        className='bg-sorbet hover:bg-sorbet-dark animate-pulse text-xl hover:animate-none'
        onClick={props.handleClaimMyProfile}
      >
        Claim This Handle
>>>>>>> b16c956 (Minor: changes CTA wording)
      </Button>
    </div>
  );
};
