'use client';

import { MoreHorizontal, SquarePen } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
  TODO: Make sure to define the type of the messages prop
*/
interface ChatSidebarProps {
  isCollapsed: boolean;
  links: {
    name: string;
    messages: any[];
    avatar: string;
    variant: 'grey' | 'ghost';
  }[];
  onClick?: () => void;
  isMobile: boolean;
}

export function ChatSidebar({
  links,
  isCollapsed,
  isMobile,
}: ChatSidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className='group relative flex h-full flex-col gap-4 p-2 data-[collapsed=true]:p-2 '
    >
      {!isCollapsed && (
        <div className='flex items-center justify-between p-2'>
          <div className='flex items-center gap-2 text-2xl'>
            <p className='font-medium'>Chats</p>
            <span className='text-zinc-300'>({links.length})</span>
          </div>

          <div>
            <Link
              href='#'
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9'
              )}
            >
              <MoreHorizontal size={20} />
            </Link>

            <Link
              href='#'
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9'
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div>
        </div>
      )}
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href='#'
                  className={cn(
                    buttonVariants({ variant: 'link', size: 'icon' }),
                    'h-11 w-11 md:h-16 md:w-16',
                    link.variant === 'grey' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <Avatar className='flex items-center justify-center'>
                    <AvatarImage
                      src={link.avatar}
                      alt={link.avatar}
                      width={6}
                      height={6}
                      className='h-10 w-10 '
                    />
                  </Avatar>{' '}
                  <span className='sr-only'>{link.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right' className='flex items-center gap-4'>
                {link.name}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href='#'
              className={cn(
                buttonVariants({ variant: 'link', size: 'lg' }),
                link.variant === 'grey' &&
                  'dark:bg-muted dark:hover:bg-muted shrink dark:text-white dark:hover:text-white',
                'justify-start gap-4'
              )}
            >
              <Avatar className='flex items-center justify-center'>
                <AvatarImage
                  src={link.avatar}
                  alt={link.avatar}
                  width={6}
                  height={6}
                  className='h-10 w-10 '
                />
              </Avatar>
              <div className='flex max-w-28 flex-col'>
                <span>{link.name}</span>
                {link.messages.length > 0 && (
                  <span className='truncate text-xs text-zinc-300 '>
                    {link.messages[link.messages.length - 1].name.split(' ')[0]}
                    : {link.messages[link.messages.length - 1].message}
                  </span>
                )}
              </div>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
