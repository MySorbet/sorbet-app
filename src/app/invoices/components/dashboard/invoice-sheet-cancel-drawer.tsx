'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type InvoiceSheetCancelDrawerProps = {
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Whether the drawer is open */
  open?: boolean;
  /** Callback to set the open state */
  setOpen?: (open: boolean) => void;
  /** Whether the drawer should display a loading state */
  isLoading?: boolean;
};

/**
 * Mini drawer component to confirm cancellation of an invoice (shown in the invoice sheet)
 */
export const InvoiceSheetCancelDrawer = ({
  onCancel,
  open,
  setOpen,
  isLoading,
}: InvoiceSheetCancelDrawerProps) => {
  const [isVisible, setIsVisible] = useState(open);

  // Animate out the drawer before setting it to display: hidden
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 150); // Matches default animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleBack = () => {
    setOpen?.(false);
  };

  return (
    <div
      className={cn(
        'bg-muted flex h-40 flex-col items-center justify-between rounded-t-xl p-3',
        'animate-in slide-in-from-bottom',
        !open && 'animate-out slide-out-to-bottom', // initiate slide out as soon as open is false
        !isVisible ? 'hidden' : 'absolute bottom-0 left-0 right-0', // Only hide after animation is complete
        !open && 'pointer-events-none' // Prevent interactions during animation
      )}
    >
      <div className='flex flex-col gap-1 pt-3 text-center'>
        <span className='text-sm font-semibold'>Are you sure?</span>
        <span className='text-xs'>
          This will permanently cancel your invoice
        </span>
      </div>
      <div className='flex w-full gap-2'>
        <Button variant='outline' className='w-full' onClick={handleBack}>
          Go back
        </Button>
        <Button
          variant='destructive'
          className='w-full'
          onClick={onCancel}
          disabled={isLoading}
        >
          {isLoading ? 'Cancelling...' : 'Cancel invoice'}
        </Button>
      </div>
    </div>
  );
};
