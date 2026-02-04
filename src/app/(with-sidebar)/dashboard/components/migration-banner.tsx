'use client';

import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

/**
 * Green announcement banner prompting Bridge users to migrate to Due verification.
 * Displayed for users who are verified on Bridge but not yet on Due.
 */
export const MigrationBanner = ({
  className,
  onComplete,
}: {
  className?: string;
  onComplete?: () => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/verify');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-start justify-between gap-3 rounded-lg border border-[#86E47C] bg-[#F8FFF7] px-4 py-3 shadow-sm sm:flex-row sm:items-center',
        className
      )}
    >
      {/* Message */}
      <div className='flex-1'>
        <h3 className='text-sm font-semibold text-gray-900'>
          Action Required: Update Your Verification
        </h3>
        <p className='mt-1 text-sm text-gray-700'>
          To comply with updated regulatory requirements, we've upgraded our
          verification system. Please re-verify your account to continue using
          your linked bank accounts without interruption.
        </p>
      </div>

      {/* Button with gradient border */}
      <button
        onClick={handleClick}
        className='flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-r from-[#64AD5C] to-[#86E47C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
      >
        <RefreshCw className='size-4' />
        Re-verify your account
      </button>
    </div>
  );
};
