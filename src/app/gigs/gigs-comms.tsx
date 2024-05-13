'use client';

import { ChatLayoutMinimal } from '@/app/gigs/chat';
import { ContractContainer, ContractOverview } from '@/app/gigs/contract';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  MessageCircle as IconMessage,
  FileCheck2 as IconContract,
} from 'lucide-react';
import React, { useState } from 'react';

export interface GigsCommsProps {
  isOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  isClient?: boolean;
}

enum ActiveTab {
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
  isClient = false,
}: GigsCommsProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Chat);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className='bg-[#F3F3F4]/90' />
      <DialogContent className='flex flex-col lg:h-[75vh] max-w-[900px] rounded-2xl'>
        <div className='flex justify-between px-4 py-2 h-14'>
          <DialogTitle className='text-2xl'>Chat with Rami</DialogTitle>
          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {activeTab === ActiveTab.Chat && (
          <ChatLayoutMinimal defaultLayout={undefined} navCollapsedSize={8} />
        )}
        {activeTab === ActiveTab.Contract &&
          (isClient ? <ContractOverview /> : <ContractContainer />)}
      </DialogContent>
    </Dialog>
  );
};
