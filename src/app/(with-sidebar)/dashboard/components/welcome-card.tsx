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
        'flex w-full flex-col items-start justify-between gap-4 border-b px-4 pt-[1px] pb-4',
        'sm:flex-row sm:items-center sm:gap-6 sm:px-6',
        'md:min-h-[72px]',
        className
      )}
    >
      <div className='min-w-0 flex-1 space-y-0.5'>
        <h2 className='text-xl font-semibold sm:text-2xl'>
          {title}
        </h2>
        <p className='text-muted-foreground text-xs sm:text-sm'>
          Manage your account and monitor activity
        </p>
      </div>

      <div className='flex w-full shrink-0 gap-2 sm:w-auto sm:gap-3'>
        <Button
          variant='outline'
          onClick={onDeposit}
          className='flex-1 gap-2 sm:flex-none'
          size='sm'
        >
          <Plus className='size-4' />
          <span className='sm:inline'>Deposit</span>
        </Button>
        <Button
          variant='sorbet'
          onClick={onSendFunds}
          className='flex-1 gap-2 sm:flex-none'
          size='sm'
        >
          <Send className='size-4' />
          <span className='sm:inline'>Send Funds</span>
        </Button>
      </div>
    </div>
  );
};
