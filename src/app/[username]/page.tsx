'use client';

import { createOffer } from '@/api/gigs';
import { getUserByAccountId } from '@/api/user';
import {
  ProjectFormValues,
  ProjectOfferDialog,
} from '@/app/[username]/project-offer-dialog';
import { GigsComms } from '@/app/gigs/gigs-comms';
import { UserSocialPreview } from '@/components/common';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { config } from '@/lib/config';
import { User } from '@/types';
import { ensureValidAccountId } from '@/utils/user';
import { useEffect, useState } from 'react';

const UserProfile = ({ params }: { params: { username: string } }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [notFound, setNotFound] = useState<boolean | undefined>(undefined);
  const [isOfferDialogOpen, setOfferDialogOpen] = useState(false);
  const [offerSent, setOfferSent] = useState<boolean>(false);
  const [freelancerUsername, setFreelancerUsername] = useState<
    string | undefined
  >(undefined);
  const [clientUsername, setClientUsername] = useState<string | undefined>(
    undefined
  );
  const { user: loggedInUser } = useAuth();
  const { toast } = useToast();

  const onOfferSubmit = async (data: ProjectFormValues) => {
    if (clientUsername && freelancerUsername) {
      const response = await createOffer({
        projectName: data.projectName,
        description: data.description,
        projectStart: data.projectStarting,
        budget: data.budget,
        clientUsername: ensureValidAccountId(clientUsername),
        freelancerUsername: ensureValidAccountId(freelancerUsername),
      });

      if (response && response.data) {
        setOfferSent(true);
        return;
      } else {
        toast({
          title: 'Something went wrong',
          description: 'We were unable to send your offer. Please try again',
        });
        return;
      }
    }
  };

  useEffect(() => {
    setFreelancerUsername(params.username);
    setClientUsername(loggedInUser ? loggedInUser.accountId : undefined);

    const fetchUser = async () => {
      if (params.username.length > 0) {
        const userResponse = await getUserByAccountId(
          `${params.username}.${config.networkId}`
        );
        if (userResponse.data) {
          setUser(userResponse.data as User);
        } else {
          setNotFound(true);
        }
      }
    };
    fetchUser();
  }, [params.username, loggedInUser]);

  const onOfferDialogClose = (open: boolean) => {
    setOfferDialogOpen(open);
  };

  return (
    <>
      {!notFound && <Header isPublic />}
      {user && (
        <>
          <Profile
            user={user}
            canEdit={false}
            onHireMeClick={() => setOfferDialogOpen(true)}
            disableHireMe={
              !clientUsername || freelancerUsername === clientUsername
            }
          />
          <UserSocialPreview title={`${user.firstName} ${user.lastName}`} />
          <ProjectOfferDialog
            isOpen={isOfferDialogOpen}
            onClose={onOfferDialogClose}
            onSubmit={onOfferSubmit}
            name={`${user.firstName} ${user.lastName}`}
            formSubmitted={offerSent}
          />
        </>
      )}
      {notFound && (
        <div className='container mt-4 w-full h-[100vh]'>
          <div className='flex flex-col gap-10 w-full h-full justify-center items-center align-center'>
            <div>
              <img src='/svg/logo.svg' alt='logo' width={100} height={100} />
            </div>
            <div>
              <div className='bg-gray-100 p-6 border border-1 border-gray-200 text-4xl justify-center flex rounded-xl'>
                <span className='text-gray-500'>mysorbet.xyz/</span>
                <span>{params.username}</span>
              </div>
              <div className='mt-4 text-center'>
                The handle is available for you to build your internet presence
                today!
              </div>
            </div>
            <Button size={`lg`} className='bg-sorbet text-xl'>
              Claim Handle Today
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
