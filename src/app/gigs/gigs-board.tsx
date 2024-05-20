import { GigsColumn } from './gigs-column';
import { GigsCard } from '@/app/gigs/gigs-card';
import { GigsComms } from '@/app/gigs/gigs-comms';
import React from 'react';

export interface GigsBoardProps {
  isClient?: boolean;
}

export const GigsBoard = ({ isClient = false }) => {
  const [isCommsOpen, setIsCommsOpen] = React.useState(false);

  const handleCardClick = () => {
    setIsCommsOpen(true);
  };

  const onGigsCommsOpenChange = (open: boolean) => {
    setIsCommsOpen(open);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <GigsComms
          isOpen={isCommsOpen}
          onOpenChange={onGigsCommsOpenChange}
          isClient={isClient}
        />
        <GigsColumn title={isClient ? 'Offers Sent' : 'Offers'} count={1}>
          <div onClick={handleCardClick}>
            <GigsCard
              requester='Humza Khan'
              requesterImage='https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png'
              title='Sorbet Figma Designs'
              skills={['UI', 'UX', 'Product']}
            />
          </div>
        </GigsColumn>
        <GigsColumn title='In-progress' count={2}>
          <div onClick={handleCardClick}>
            <GigsCard
              requester='Humza Khan'
              requesterImage='https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png'
              title='Sorbet MVP Development'
              skills={['Full Stack Development', 'DevOps', 'Product Design']}
            />
          </div>
          <div onClick={handleCardClick}>
            <GigsCard
              requester='Humza Khan'
              requesterImage='https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png'
              title='Sorbet MVP Development'
              skills={['Full Stack Development', 'DevOps', 'Product Design']}
            />
          </div>
        </GigsColumn>
        <GigsColumn title='Completed' count={0}></GigsColumn>
      </div>
    </div>
  );
};
