'use client';

import Container from '@/app/container';
import { GigsBoard } from '@/app/gigs/gigs-board';
import { Header } from '@/components';
import { PageTitle } from '@/components/common';
import { useEffect, useState } from 'react';

export const GigsContainer = () => {
  const [gigs, setGigs] = useState([]);

  return (
    <Container>
      <Header />
      <div className='container mt-12 lg:mt-24'>
        <GigsBoard />
      </div>
    </Container>
  );
};
