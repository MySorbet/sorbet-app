'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAfter } from '@/hooks/use-after';
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

  // Build fn to set isVisible to false after the animation is complete
  // 150ms animation - 10ms to avoid flickering
  const setVisibleFalse = useAfter(() => {
    setIsVisible(false);
  }, 150 - 10);

  // Animate out the drawer before setting it to display: hidden
  useEffect(() => {
    open ? setIsVisible(true) : setVisibleFalse();
  }, [open, setVisibleFalse]);

  const handleBack = () => {
    setOpen?.(false);
  };

  return (
    <div
      className={cn(
        'bg-background flex flex-col items-center justify-between rounded-xl p-6 border shadow-lg m-4',
        'animate-in slide-in-from-bottom fade-in-0 duration-200',
        !open && 'animate-out slide-out-to-bottom fade-out-0 duration-200', // initiate slide out as soon as open is false
        !isVisible ? 'hidden' : 'absolute bottom-0 left-0 right-0 z-50', // Only hide after animation is complete
        !open && 'pointer-events-none' // Prevent interactions during animation
      )}
    >
      <div className='flex flex-col gap-2 pb-6 text-center'>
        <span className='text-base font-semibold'>Are you sure?</span>
        <span className='text-muted-foreground text-sm'>
          This will permanently cancel your invoice
        </span>
      </div>
      <div className='flex w-full flex-col gap-3'>
        <Button
          variant='destructive'
          className='w-full'
          onClick={onCancel}
          disabled={isLoading}
        >
          {isLoading ? 'Cancelling...' : 'Yes, cancel my invoice'}
        </Button>
        <Button variant='outline' className='w-full' onClick={handleBack}>
          Go back
        </Button>
      </div>
    </div>
  );
};
