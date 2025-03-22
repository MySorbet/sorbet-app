'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getUserByHandle } from '@/api/user';
import {
  ProjectFormValues,
  ProjectOfferDialog,
} from '@/app/[handle]/project-offer-dialog';
import Page from '@/components/common/page';
import { Profile } from '@/components/profile';
import { useAuth } from '@/hooks/use-auth';

import { ClaimYourProfile } from './claim-your-profile';

const ProfilePage = ({ params }: { params: { handle: string } }) => {
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const queryClient = useQueryClient();

  // Mutation to be called when an offer is sent from the logged in user to the freelancer
  const mutation = useMutation({
    mutationFn: (projectFormValues: ProjectFormValues) => {
      if (!user) throw new Error('User not found');
      if (!user.handle) throw new Error('User handle not found');

      // TODO: We used to create an offer here, but now, we will just do nothing
      // In the future, we could use this to generate an email or notification
      const offer = {
        projectName: projectFormValues.projectName,
        description: projectFormValues.description,
        projectStart: projectFormValues.projectStarting,
        budget: projectFormValues.budget,
        clientUsername: user.handle,
        freelancerUsername: params.handle,
      };

      console.log('offer', offer);
      return Promise.resolve(offer);
    },
    onError: () => {
      toast.error('Unable to send offer', {
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
    <div className='flex w-full flex-col'>
      {isError ? (
        <ClaimYourProfile
          handle={params.handle}
          handleClaimMyProfile={() => router.push('/signin')}
        />
      ) : (
        !isPending &&
        freelancer && (
          <Page.Main>
            <Page.Content>
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
            </Page.Content>
          </Page.Main>
        )
      )}
    </div>
  );
};

export default ProfilePage;
