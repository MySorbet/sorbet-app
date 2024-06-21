'use client';

import Container from '@/app/container';
import { GigsBoard } from '@/app/gigs/gigs-board';
import { Header, Sidebar } from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth, useLocalStorage } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { GigsContentType } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export interface GigsContainerProps {
  isClient?: boolean;
}

export const GigsContainer = ({ isClient = false }) => {
  const { user: loggedInUser } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);
  const [lastChainOp, setLastChainOp] = useLocalStorage<string>(
    'lastChainOp',
    ''
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const getSuccessNotification = () => {
    if (lastChainOp !== '') {
      switch (lastChainOp) {
        case 'create_project':
          return {
            title: 'Project created successfully',
            description: 'Your project was created successfully.',
          };
        case 'fund_schedule':
          return {
            title: 'Milestone funded',
            description: 'The milestone was funded successfully',
          };
        default:
          return {
            title: '',
            description: '',
          };
      }
    }

    return {
      title: 'Unknown',
      description: 'Unknown op',
    };
  };

  useEffect(() => {
    const transactionHashes = searchParams.get('transactionHashes');
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('errorMessage');

    if (transactionHashes && !errorCode && !errorMessage) {
      const { title, description } = getSuccessNotification();
      toast({ title, description });
    } else if (transactionHashes && errorCode && errorMessage) {
      toast({
        title: 'Transaction failed',
        description: `Transaction failed with error: ${decodeURIComponent(
          errorMessage
        )}`,
        variant: 'destructive',
      });
    }
  }, [router, toast]);

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
