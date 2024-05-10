import { GigsColumn } from './gigs-column';
import { GigsCard } from '@/app/gigs/gigs-card';
import { GigsComms } from '@/app/gigs/gigs-comms';
import React from 'react';

export const GigsBoard = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <GigsComms isOpen={true} />
        <GigsColumn title='Offers' count={1}>
          <GigsCard
            requester='Humza Khan'
            requesterImage='https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png'
            title='Sorbet Figma Designs'
            skills={['UI', 'UX', 'Product']}
          />
        </GigsColumn>
        <GigsColumn title='In-progress' count={2}>
          <GigsCard
            requester='Humza Khan'
            requesterImage='https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png'
            title='Sorbet MVP Development'
            skills={['Full Stack Development', 'DevOps', 'Product Design']}
          />
          <GigsCard
            requester='Humza Khan'
            requesterImage='https://storage.googleapis.com/sorbet-profile-images/928663b9-9298-4498-b090-d7b8acd9c882.png'
            title='Sorbet MVP Development'
            skills={['Full Stack Development', 'DevOps', 'Product Design']}
          />
        </GigsColumn>
        <GigsColumn title='Completed' count={0}></GigsColumn>
      </div>
    </div>
  );
};
