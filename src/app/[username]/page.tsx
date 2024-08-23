'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { createOffer } from '@/api/gigs';
import { getUserByHandle } from '@/api/user';
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
        // TODO: This will be broken until createOffer uses their handle
        // clientUsername: withSuffix(user.accountId),
        // freelancerUsername: withSuffix(params.username),
        clientUsername: user.handle ?? '',
        freelancerUsername: params.username,
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
    queryFn: () => getUserByHandle(`${params.username}`),
  });

  // Alias some vars for easy access in JSX
  const freelancer = freelancerResponse?.data;
  console.log('Freelancer: ', user);
  const isMyProfile = params.username === user?.handle;
  const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  return (
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
