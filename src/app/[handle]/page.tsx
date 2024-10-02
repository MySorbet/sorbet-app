'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { createOffer } from '@/api/gigs';
import { getUserByHandle } from '@/api/user';
import {
  ProjectFormValues,
  ProjectOfferDialog,
} from '@/app/[handle]/project-offer-dialog';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

import { ClaimYourProfile } from './claim-your-profile';

const ProfilePage = ({ params }: { params: { handle: string } }) => {
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const queryClient = useQueryClient();

  // Mutation to be called when an offer is sent from the logged in user to the freelancer
  const mutation = useMutation({
    mutationFn: (projectFormValues: ProjectFormValues) => {
      if (!user) throw new Error('User not found');
      if (!user.handle) throw new Error('User handle not found');

      return createOffer({
        projectName: projectFormValues.projectName,
        description: projectFormValues.description,
        projectStart: projectFormValues.projectStarting,
        budget: projectFormValues.budget,
        clientUsername: user.handle,
        freelancerUsername: params.handle,
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
    queryKey: ['freelancer', params.handle], // --> 2nd arg is for a more detailed query key
    queryFn: () => getUserByHandle(params.handle),
  });

  // Alias some vars for easy access in JSX
  const freelancer = freelancerResponse?.data;
  const isMyProfile = user?.handle === params.handle;
  const disableHireMe = isMyProfile || !user;
  const hideShare = !isMyProfile || !user;
  const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  /**
   * This effect is to refetch at the parent level when a username is updated.
   * Previously, we were refetching in the profile-edit-modal component and it was resulting
   * in stale data. For now, this manual fix works.
   */
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['freelancer', params.handle] });
  }, [queryClient, params.handle]);

  return (
    <>
      {isError ? (
        <ClaimYourProfile
          handle={params.handle}
          handleClaimMyProfile={() => router.push('/signin')}
        />
      ) : (
        <>
          <Header />
          {!isPending && freelancer && (
            <>
              <Profile
                user={freelancer}
                canEdit={isMyProfile}
                onHireMeClick={() => setOfferDialogOpen(true)}
                disableHireMe={disableHireMe}
                hideShare={hideShare}
              />
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
    </>
  );
};

export default ProfilePage;
