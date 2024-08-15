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
import { ensureValidAccountId } from '@/utils/user';

import Container from '../container';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const freelancerUsername = params.username;

  const mutation = useMutation({
    mutationFn: (projectFormValues: ProjectFormValues) => {
      if (!user) throw new Error('User not found');
      return createOffer({
        projectName: projectFormValues.projectName,
        description: projectFormValues.description,
        projectStart: projectFormValues.projectStarting,
        budget: projectFormValues.budget,
        clientUsername: ensureValidAccountId(user.accountId),
        freelancerUsername: ensureValidAccountId(freelancerUsername),
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'We were unable to send your offer. Please try again',
      });
    },
  });

  const {
    isPending,
    isError,
    data: freelancerResponse,
  } = useQuery({
    queryKey: ['freelancer'],
    queryFn: () => getUserByAccountId(`${params.username}.${config.networkId}`),
  });

  const freelancer = freelancerResponse?.data as User;
  const disableHireMe = freelancerUsername === user?.accountId;
  const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  return (
    <Container>
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
      {isError && <ClaimYourProfile username={freelancerUsername} />}
    </Container>
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
