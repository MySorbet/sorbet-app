'use client';

import Container from '@/app/container';
import { GigsBoard } from '@/app/gigs/gigs-board';
import { Header, Sidebar } from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { GigsContentType } from '@/types';

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
          <div className='flex justify-center items-center w-[100%]'>
            <Tabs defaultValue='received' className='w-[100%]'>
              <TabsList className='flex justify-center mb-8'>
                <TabsTrigger value='received'>Offers Received</TabsTrigger>
                <TabsTrigger value='sent'>Offers Sent</TabsTrigger>
              </TabsList>
              <TabsContent value='sent'>
                <GigsBoard gigsContentType={GigsContentType.Sent} />
              </TabsContent>

              <TabsContent value='received'>
                <GigsBoard gigsContentType={GigsContentType.Received} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </Container>
  );
};
