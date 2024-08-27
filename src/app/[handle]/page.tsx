'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createOffer } from '@/api/gigs';
import { getUserByAccountId } from '@/api/user';
import {
  ProjectFormValues,
  ProjectOfferDialog,
} from '@/app/[handle]/project-offer-dialog';
import { UserSocialPreview } from '@/components/common';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { config } from '@/lib/config';
import { User } from '@/types';
import { withSuffix } from '@/utils/user';

import { ClaimYourProfile } from './claim-your-profile';

const ProfilePage = ({ params }: { params: { handle: string } }) => {
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

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
        freelancerUsername: withSuffix(params.handle),
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
    queryFn: () => getUserByAccountId(`${params.handle}.${config.networkId}`),
  });

  // Alias some vars for easy access in JSX
  const freelancer = freelancerResponse?.data as User;
  const disableHireMe = params.handle === user?.accountId.split('.')[0];
  const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  const handleClaimMyProfile = () => {
    router.push('/signin');
  };

  return (
    <>
      {isError ? (
        <ClaimYourProfile
          handle={params.handle}
          handleClaimMyProfile={handleClaimMyProfile}
        />
      ) : (
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
    </>
  );
};

export default ProfilePage;
