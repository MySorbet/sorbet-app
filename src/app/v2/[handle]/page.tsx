'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getUserByHandle } from '@/api/user';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Profile } from './components/profile';

/** Profile 2.0 page */
const ProfilePage = ({ params }: { params: { handle: string } }) => {
  // const { user } = useAuth();

  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    data: freelancerResponse,
  } = useQuery({
    queryKey: ['freelancer', params.handle],
    queryFn: () => getUserByHandle(params.handle),
  });

  // Alias some vars for easy access in JSX
  const freelancer = freelancerResponse?.data;
  // const isMyProfile = user?.handle === params.handle;
  // const disableHireMe = isMyProfile || !user;
  // const hideShare = !isMyProfile || !user;
  // const freelancerFullName = `${freelancer?.firstName} ${freelancer?.lastName}`;

  /**
   * This effect is to refetch at the parent level when a username is updated.
   * Previously, we were refetching in the profile-edit-modal component and it was resulting
   * in stale data. For now, this manual fix works.
   */
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['freelancer', params.handle] });
  }, [queryClient, params.handle]);

  return (
    <Page.Main>
      <Header />
      <Page.Content>
        {isError ? (
          <div>This profile does not exist. Claim yours now</div>
        ) : (
          !isPending && freelancer && <Profile user={freelancer} />
        )}
      </Page.Content>
    </Page.Main>
  );
};

export default ProfilePage;
