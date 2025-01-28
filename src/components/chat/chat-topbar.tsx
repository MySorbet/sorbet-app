import { Info, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatTopbarProps {
  selectedUser: any;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  return (
    <div className='flex h-20 w-full items-center justify-between border-b p-4'>
      <div className='flex items-center gap-2'>
        <Avatar className='flex items-center justify-center'>
          <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={6}
            height={6}
            className='h-10 w-10 '
          />
        </Avatar>
        <div className='flex flex-col'>
          <span className='font-medium'>{selectedUser.name}</span>
          <span className='text-xs'>Active 2 mins ago</span>
        </div>
      </div>

      <div>
        {TopbarIcons.map((icon, index) => (
          <Link
            key={index}
            href='#'
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'h-9 w-9',
              'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            )}
          >
            <icon.icon size={20} className='text-muted-foreground' />
          </Link>
        ))}
      </div>
    </div>
  );
}
