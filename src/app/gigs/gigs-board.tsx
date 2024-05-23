import { GigsColumn } from './gigs-column';
import {
  getClientOffers,
  getFreelancerOffers,
  updateOfferStatus,
} from '@/api/gigs';
import { GigsCard } from '@/app/gigs/gigs-card';
import { GigsComms } from '@/app/gigs/gigs-comms';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks';
import { FormattedResponse, OfferType } from '@/types';
import React, { useEffect, useState } from 'react';

export interface GigsBoardProps {
  isClient?: boolean;
}

export const GigsBoard = ({ isClient = false }) => {
  const [isCommsOpen, setIsCommsOpen] = React.useState(false);
  const [offers, setOffers] = React.useState([]);
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
  const { toast } = useToast();

  const fetchOffers = async () => {
    if (loggedInUser?.accountId) {
      let response: FormattedResponse | undefined;

      switch (loggedInUser?.userType) {
        case 'CLIENT':
          response = await getClientOffers(loggedInUser?.accountId, 'Pending');
          break;
        case 'FREELANCER':
          response = await getFreelancerOffers(
            loggedInUser?.accountId,
            'Pending'
          );
          break;
      }

      if (response && response.status === 'success') {
        setOffers(response.data);
      } else {
        toast({
          title: 'Unable to load offers',
          description: 'Contact support if issue persists',
        });
      }
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCardClick = (offer: OfferType) => {
    setIsCommsOpen(true);
    setCurrentOffer(offer);
  };

  const onGigsCommsOpenChange = (open: boolean) => {
    setIsCommsOpen(open);
  };

  const afterContractSubmitted = () => {
    fetchOffers();
    // TODO: fetch active contracts
  };

  const handleOfferReject = async () => {
    if (currentOffer) {
      if (confirm('Are you sure you want to reject this offer?')) {
        await updateOfferStatus(currentOffer.id, 'Rejected');
        toast({
          title: 'Offer rejected',
          description: 'The offer was rejected successfully',
        });
        setIsCommsOpen(false);
        fetchOffers();
      } else {
        // Logic to handle cancellation of rejection
        console.log('Rejection cancelled.');
      }
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <GigsComms
          isOpen={isCommsOpen}
          onOpenChange={onGigsCommsOpenChange}
          isClient={isClient}
          currentOffer={currentOffer}
          handleRejectOffer={handleOfferReject}
          afterContractSubmitted={afterContractSubmitted}
          currentOfferId={currentOffer?.id}
        />
        <GigsColumn
          title={isClient ? 'Offers Sent' : 'Offers'}
          count={offers?.length || 0}
        >
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
