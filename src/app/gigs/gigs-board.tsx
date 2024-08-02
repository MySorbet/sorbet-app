import { GigsColumn } from './gigs-column';
import { GigsCard } from '@/app/gigs/gigs-card';
import { GigsComms } from '@/app/gigs/gigs-comms';
import { useAuth, useUpdateOfferStatus } from '@/hooks';
import { useFetchOffers } from '@/hooks/gigs/useFetchOffers';
import { GigsContentType, OfferType } from '@/types';
import { Loader } from 'lucide-react';
import { useState } from 'react';

export interface GigsBoardProps {
  gigsContentType: GigsContentType;
}

export const GigsBoard = ({ gigsContentType }: GigsBoardProps) => {
  const [isCommsOpen, setIsCommsOpen] = useState(false);
  const { user: loggedInUser } = useAuth();
  const [currentOffer, setCurrentOffer] = useState<OfferType | undefined>(
    undefined
  );

  const { isLoading: isFetchOffersLoading, data: offers } = useFetchOffers(
    loggedInUser,
    gigsContentType,
    ''
  );

  const pendingOffers = offers?.filter(
    (offer: OfferType) => offer.status === 'Pending'
  );
  const acceptedOffers = offers?.filter(
    (offer: OfferType) => offer.status === 'Accepted'
  );
  const completedOffers = offers?.filter(
    (offer: OfferType) => offer.status === 'Completed'
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
          count={pendingOffers?.length || 0}
        >
          {isFetchOffersLoading && <Loader />}
          {pendingOffers?.map((offer: OfferType) => (
            <div onClick={() => handleCardClick(offer)} key={offer.id}>
              <GigsCard
                requester={offer.name}
                requesterImage={offer.profileImage}
                title={offer.projectName}
                status={offer.status}
                projectStart={offer.projectStart}
                budget={offer.budget}
              />
            </div>
          ))}
        </GigsColumn>
        <GigsColumn title='In-progress' count={acceptedOffers?.length || 0}>
          {isFetchOffersLoading && <Loader />}
          {acceptedOffers?.map((offer: OfferType) => (
            <div onClick={() => handleCardClick(offer)} key={offer.id}>
              <GigsCard
                requester={offer.name}
                requesterImage={offer.profileImage}
                title={offer.projectName}
                status={offer.status}
                projectStart={offer.projectStart}
                budget={offer.budget}
              />
            </div>
          ))}
        </GigsColumn>
        <GigsColumn title='Completed' count={completedOffers?.length || 0}>
          {isFetchOffersLoading && <Loader />}
          {completedOffers?.map((offer: OfferType) => (
            <div onClick={() => handleCardClick(offer)} key={offer.id}>
              <GigsCard
                requester={offer.name}
                requesterImage={offer.profileImage}
                title={offer.projectName}
                status={offer.status}
                projectStart={offer.projectStart}
                budget={offer.budget}
              />
            </div>
          ))}
        </GigsColumn>
      </div>
    </div>
  );
};
