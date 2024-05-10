'use client';

import { ChatLayout, ChatLayoutMinimal } from '@/app/gigs/chat';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  MessageCircle as IconMessage,
  FileCheck2 as IconContract,
} from 'lucide-react';
import React, { useState } from 'react';

export interface GigsCommsProps {
  isOpen?: boolean;
}

enum ActiveTab {
  Chat,
  Contract,
}

export const GigsComms = ({ isOpen = false }: GigsCommsProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Chat);

  return (
    <Dialog open={isOpen}>
      <DialogContent className='w-[95vw] md:min-w-[80vw] lg:min-w-[55vw]'>
        <div className='flex justify-between px-4 py-2'>
          <DialogTitle className='text-2xl'>Chat with Rami</DialogTitle>
          <div className='border border-1 border-solid border-gray-100 rounded-full'>
            <Button
              variant={`outline`}
              className={cn(
                'rounded-full border-none outline-none gap-2 active:ouline-none focus:outline-none',
                `${activeTab === ActiveTab.Chat && `bg-sorbet text-white`}`
              )}
              onClick={() => setActiveTab(ActiveTab.Chat)}
            >
              <span>Chat</span>
              <span>
                <IconMessage size={15} />
              </span>
            </Button>
            <Button
              variant={`outline`}
              className={cn(
                'rounded-full border-none gap-2 active:ouline-none focus:outline-none',
                `${activeTab === ActiveTab.Contract && `bg-sorbet text-white`}`
              )}
              onClick={() => setActiveTab(ActiveTab.Contract)}
            >
              <span>Contract</span>
              <span>
                <IconContract size={15} />
              </span>
            </Button>
          </div>
        </div>
        <div>
          <ChatLayoutMinimal defaultLayout={undefined} navCollapsedSize={8} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
