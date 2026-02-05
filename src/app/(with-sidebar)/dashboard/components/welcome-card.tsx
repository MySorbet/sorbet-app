import { Plus, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Main header for the dashboard with welcome message and action buttons */
export const WelcomeCard = ({
  name,
  onDeposit,
  onSendFunds,
  className,
}: {
  name?: string;
  onDeposit?: () => void;
  onSendFunds?: () => void;
  className?: string;
}) => {
  const title = name ? `Welcome, ${name}` : 'Welcome to Sorbet';
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px]',
        'sm:flex-row sm:items-center sm:gap-6 sm:px-6',
        'md:min-h-[72px]',
        className
      )}
    >
      {/* Mobile: Title + Buttons in one row */}
      <div className='flex w-full items-center justify-between sm:hidden'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='flex shrink-0 gap-2'>
          <Button
            variant='outline'
            onClick={onDeposit}
            size='icon'
            className='size-9'
          >
            <Plus className='size-4' />
          </Button>
          <Button
            variant='sorbet'
            onClick={onSendFunds}
            size='icon'
            className='size-9'
          >
            <Send className='size-4' />
          </Button>
        </div>
      </div>

      {/* Desktop: Original layout */}
      <div className='hidden min-w-0 flex-1 space-y-0.5 sm:block'>
        <h2 className='text-2xl font-semibold'>{title}</h2>
        <p className='text-muted-foreground text-sm'>
          Manage your account and monitor activity
        </p>
      </div>

      <div className='hidden shrink-0 gap-3 sm:flex'>
        <Button
          variant='outline'
          onClick={onDeposit}
          className='gap-2'
          size='sm'
        >
          <Plus className='size-4' />
          <span>Deposit</span>
        </Button>
        <Button
          variant='sorbet'
          onClick={onSendFunds}
          className='gap-2'
          size='sm'
        >
          <Send className='size-4' />
          <span>Send Funds</span>
        </Button>
      </div>
    </div>
  );
};
