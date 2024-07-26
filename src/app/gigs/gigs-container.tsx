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

export const GigsContainer = () => {
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
    let response = {
      title: 'Unknown',
      description: 'Unknown op',
    };

    if (lastChainOp !== '') {
      switch (lastChainOp) {
        case 'create_project':
          response = {
            title: 'Project created successfully',
            description: 'Your project was created successfully.',
          };
          break;
        case 'fund_schedule':
          response = {
            title: 'Milestone funded',
            description: 'The milestone was funded successfully',
          };
          break;
        case 'end_project':
          response = {
            title: 'Contract ended',
            description: 'The project was ended successfully',
          };
          break;
        case 'approve_schedule':
          response = {
            title: 'Funds approved',
            description: 'The project/milestone was approved',
          };
          break;
        default:
          response = {
            title: '',
            description: '',
          };
          break;
      }
    }

    setLastChainOp('');
    return response;
  };

  useEffect(() => {
    const transactionHashes = searchParams.get('transactionHashes');
    const errorCode = searchParams.get('errorCode');
    const errorMessage = searchParams.get('errorMessage');

    if (transactionHashes && !errorCode && !errorMessage) {
      const { title, description } = getSuccessNotification();
      toast({ title, description });
    } else if (errorCode && errorMessage) {
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
