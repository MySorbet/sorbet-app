'use client';

import Container from '@/app/container';
import { GigsBoard } from '@/app/gigs/gigs-board';
import { Header, Sidebar } from '@/components';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';

export interface GigsContainerProps {
  isClient?: boolean;
}

export const GigsContainer = ({ isClient = false }) => {
  const { user: loggedInUser } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);

  return (
    <Container>
      <Header />
      {loggedInUser && (
        <>
          <Sidebar show={toggleOpenSidebar} userInfo={loggedInUser} />
          <div className='container mt-12 lg:mt-24'>
            <GigsBoard isClient={loggedInUser?.userType === 'CLIENT'} />
          </div>
        </>
      )}
    </Container>
  );
};
