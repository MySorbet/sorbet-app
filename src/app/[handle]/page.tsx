'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';

import { getUserByHandle } from '@/api/user';
import { HandleAvailable } from '@/app/[handle]/components/handle-available';
import Page from '@/components/common/page';
import { useAuth } from '@/hooks/use-auth';

import { ClaimYourHandle } from './components/claim-your-handle/claim-your-handle';
import { Profile } from './components/profile';
import { WidgetProvider } from './components/widget/use-widget-context';

/** Profile 2.0 page */
const ProfilePage = ({ params }: { params: { handle: string } }) => {
  const { user } = useAuth();

  const {
    isLoading,
    isError,
    data: freelancer,
  } = useQuery({
    queryKey: ['freelancer', params.handle],
    queryFn: () => getUserByHandle(params.handle),
    retry: (_, error) => !(isAxiosError(error) && error.status === 404),
  });

  // Alias some vars for easy access in JSX
  const isLoggedIn = Boolean(user);
  const isMine = user?.handle === params.handle;

  /**
   * This effect is to refetch at the parent level when a username is updated.
   * Previously, we were refetching in the profile-edit-modal component and it was resulting
   * in stale data. For now, this manual fix works.
   */
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['freelancer', params.handle] });
  }, [queryClient, params.handle]);

  return (
    <Page.Main className='size-full'>
      {isError ? (
        <HandleAvailable handle={params.handle} />
      ) : (
        !isLoading &&
        freelancer &&
        (isMine && !user?.hasClaimedHandle ? (
          <ClaimYourHandle />
        ) : (
          <WidgetProvider userId={freelancer.id}>
            <Profile
              user={freelancer}
              isMine={isMine}
              isLoggedIn={isLoggedIn}
            />
          </WidgetProvider>
        ))
      )}
    </Page.Main>
  );
};

export default ProfilePage;
