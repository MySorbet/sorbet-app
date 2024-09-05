'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import Authenticated from '@/app/authenticated';
import { GigsBoard } from '@/app/gigs/gigs-board';
import { Header } from '@/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth, useLocalStorage } from '@/hooks';
import { GigsContentType } from '@/types';

export const GigsContainer = () => {
  const { user: loggedInUser } = useAuth();
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
    <Authenticated>
      <Header />
      {loggedInUser && (
        <div className='flex w-[100%] items-center justify-center'>
          <Tabs defaultValue='received' className='w-[100%]'>
            <TabsList className='mb-8 flex justify-center'>
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
      )}
    </Authenticated>
  );
};
