import { Globe } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Telegram from '~/svg/telegram.svg';

/**
 * TODO: Could/should these buttons auto open the privy via a query param?
 * TODO: Should we have a "back to dashboard" button?
 */
export const ExitLinks = ({
  isLoggedIn,
  isMine,
  handle,
  className,
}: {
  isLoggedIn?: boolean;
  isMine?: boolean;
  handle?: string;
  className?: string;
}) => {
  const route = isMine ? '/dashboard' : `/${handle}`;
  const text = isMine ? 'My dashboard' : 'My Sorbet';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {isLoggedIn ? (
        <>
          <Button variant='secondary' size='sm' asChild>
            <Link href={route}>{text}</Link>
          </Button>
          <div className='flex items-center gap-4'>
            <XYZLink />
            <TelegramLink />
          </div>
        </>
      ) : (
        <>
          <Button variant='sorbet' effect='shine' size='sm' asChild>
            <Link href='/signin'>Create my Sorbet</Link>
          </Button>
          <Button variant='link' size='sm' asChild>
            <Link href='/signin'>Login</Link>
          </Button>
          <XYZLink />
        </>
      )}
    </div>
  );
};

const XYZLink = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href='https://mysorbet.xyz'
            target='_blank'
            rel='noopener noreferrer'
            className='bg-secondary text-muted-foreground hover:bg-muted-foreground/20 size-6 rounded-full p-1 transition-all duration-200 hover:scale-110'
          >
            <Globe className='size-4' />
          </a>
        </TooltipTrigger>
        <TooltipContent side='top' sideOffset={10}>
          Visit our site
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TelegramLink = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            className='bg-secondary text-muted-foreground hover:bg-muted-foreground/20 size-6 rounded-full p-1 transition-all duration-200 hover:scale-110'
            href='https://t.me/sorbetcreativecollective/1'
            target='_blank'
            rel='noopener noreferrer'
          >
            {/* 14px and optically centered */}
            <Telegram className='size-[0.875rem] pt-0.5' />
          </a>
        </TooltipTrigger>
        <TooltipContent side='top' sideOffset={10}>
          Join the community
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
