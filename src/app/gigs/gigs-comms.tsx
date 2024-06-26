'use client';

import { ChatLayoutMinimal } from '@/app/gigs/chat';
import { Message } from '@/app/gigs/chat/data';
import {
  ContractContainer,
  ContractOverview,
  ContractNotFound,
  ContractPendingOffer,
  ContractPendingFreelancer,
  ContractRejected,
} from '@/app/gigs/contract';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { useGetContractForOffer } from '@/hooks';
import { cn } from '@/lib/utils';
import { OfferType } from '@/types';
import {
  MessageCircle as IconMessage,
  FileCheck2 as IconContract,
} from 'lucide-react';
import React, { useState } from 'react';

export interface GigsCommsProps {
  isOpen?: boolean;
  isClient?: boolean;
  chatParticipantName?: string;
  freelancerUsername?: string;
  clientUsername?: string;
  currentOfferId?: string;
  currentOffer?: OfferType;
  onOpenChange: (open: boolean) => void;
  handleRejectOffer?: () => void;
  afterContractSubmitted?: () => void;
}

export enum ActiveTab {
  Chat,
  Contract,
}

interface TabSelectorProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className='border border-1 border-solid border-gray-100 rounded-full h-11'>
      <Button
        variant={`outline`}
        className={cn(
          'rounded-full border-none outline-none gap-2 active:ouline-none focus:outline-none hover:bg-sorbet hover:text-white',
          `${activeTab === ActiveTab.Chat && `bg-sorbet text-white`}`
        )}
        onClick={() => setActiveTab(ActiveTab.Chat)}
      >
        <span>Chat</span>
        <IconMessage size={15} />
      </Button>
      <Button
        variant={`outline`}
        className={cn(
          'rounded-full border-none gap-2 active:ouline-none focus:outline-none hover:bg-sorbet hover:text-white',
          `${activeTab === ActiveTab.Contract && `bg-sorbet text-white`}`
        )}
        onClick={() => setActiveTab(ActiveTab.Contract)}
      >
        <span>Contract</span>
        <IconContract size={15} />
      </Button>
    </div>
  );
};

export const GigsComms = ({
  isOpen = false,
  onOpenChange,
  afterContractSubmitted,
  isClient = false,
  currentOffer,
  chatParticipantName = '',
  currentOfferId = '',
  handleRejectOffer,
}: GigsCommsProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Chat);
  const [offers, setOffers] = useState([]);

  const {
    isPending: getContractPending,
    data: contractData,
    // error: getContractError,
    // isError: isGetContractError,
  } = useGetContractForOffer({
    currentOfferId,
    isOpen,
    activeTab,
  });

  const handlewNewMessage = async (newMessage: Message) => {};

  const renderContractView = () => {
    if (isClient) {
      if (contractData) {
        if (contractData.status === 'Rejected') {
          return <ContractRejected isClient={isClient} />;
        } else {
          return (
            <ContractOverview contract={contractData} isClient={isClient} />
          );
        }
      } else {
        if (offers.length > 0) {
          return <ContractPendingOffer />;
        } else {
          return <ContractNotFound />;
        }
      }
    } else {
      if (contractData) {
        if (contractData.status === 'PendingApproval') {
          return <ContractPendingFreelancer />;
        } else if (contractData.status === 'Rejected') {
          return <ContractRejected isClient={isClient} />;
        } else {
          return (
            <ContractOverview contract={contractData} isClient={isClient} />
          );
        }
      } else {
        return (
          <ContractContainer
            handleRejectOfferClick={handleRejectOffer}
            currentOffer={currentOffer}
            afterContractSubmited={afterContractSubmitted}
          />
        );
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogOverlay className='bg-[#F3F3F4]/90' />
        <DialogContent className='flex flex-col md:h-[75vh] max-w-[900px] rounded-2xl'>
          <div className='flex justify-between px-4 py-2 h-14'>
            <DialogTitle className='text-2xl'>
              {activeTab === ActiveTab.Chat
                ? chatParticipantName !== ''
                  ? `Chat with ${chatParticipantName}`
                  : `Chat`
                : `Contract`}
            </DialogTitle>
            <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          {getContractPending ? (
            <div className='flex justify-center items-center h-full'>
              <Spinner />
            </div>
          ) : (
            <>
              {activeTab === ActiveTab.Chat && (
                <ChatLayoutMinimal
                  defaultLayout={undefined}
                  navCollapsedSize={8}
                  handlewNewMessage={handlewNewMessage}
                />
              )}
              {activeTab === ActiveTab.Contract && renderContractView()}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
