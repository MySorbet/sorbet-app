import { GigsColumn } from './gigs-column';
import { GigsCard } from '@/app/gigs/gigs-card';
import { GigsComms } from '@/app/gigs/gigs-comms';
import { useAuth, useUpdateOfferStatus } from '@/hooks';
import { useFetchOffers } from '@/hooks/gigs/useFetchOffers';
import { GigsContentType, OfferType } from '@/types';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';

export interface GigsBoardProps {
  gigsContentType: GigsContentType;
}

export const GigsBoard = ({ gigsContentType }: GigsBoardProps) => {
  const [isCommsOpen, setIsCommsOpen] = React.useState(false);
  const { user: loggedInUser } = useAuth();
  const [currentOffer, setCurrentOffer] = React.useState<OfferType | undefined>(
    undefined
  );
  const [freelancerUsername, setFreelancerUsername] = useState<
    string | undefined
  >(undefined);
  const [clientUsername, setClientUsername] = useState<string | undefined>(
    undefined
  );

  const { isLoading: isFetchOffersLoading, data: offers } = useFetchOffers(
    loggedInUser,
    gigsContentType
  );

  const { mutate: updateOfferStatus } = useUpdateOfferStatus();

  const handleCardClick = (offer: OfferType) => {
    setIsCommsOpen(true);
    setCurrentOffer(offer);
  };

  const onGigsCommsOpenChange = (open: boolean) => {
    setIsCommsOpen(open);
  };

  const afterContractSubmitted = () => {
    // fetchOffers();
    // TODO: fetch active contracts
    // After a contract is submitted, we can invalidate the query cache at the 'offers' key
  };

  const handleOfferReject = async () => {
    updateOfferStatus({ currentOffer: currentOffer, status: 'rejected' });
    setIsCommsOpen(false);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <GigsComms
          isOpen={isCommsOpen}
          onOpenChange={onGigsCommsOpenChange}
          isClient={gigsContentType === GigsContentType.Sent}
          currentOffer={currentOffer}
          handleRejectOffer={handleOfferReject}
          afterContractSubmitted={afterContractSubmitted}
          currentOfferId={currentOffer?.id}
        />
        <GigsColumn
          title={
            gigsContentType === GigsContentType.Sent
              ? 'Offers Sent'
              : 'Offers Received'
          }
          count={offers?.length || 0}
        >
          {isFetchOffersLoading && <Loader />}
          {offers?.map((offer: OfferType) => (
            <div onClick={() => handleCardClick(offer)} key={offer.id}>
              <GigsCard
                requester={offer.name}
                requesterImage={offer.profileImage}
                title={offer.projectName}
                status={offer.status}
                description={offer.projectDescription}
                skills={offer.tags}
              />
            </div>
          ))}
        </GigsColumn>
        <GigsColumn title='In-progress' count={0}></GigsColumn>
        <GigsColumn title='Completed' count={0}></GigsColumn>
      </div>
    </div>
  );
};
