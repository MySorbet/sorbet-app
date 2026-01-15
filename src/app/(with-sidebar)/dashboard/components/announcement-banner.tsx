'use client';

import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

/**
 * Green announcement banner prompting users to complete verification.
 * Displayed for unrestricted users who haven't completed KYC.
 */
export const AnnouncementBanner = ({
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
            <p className='text-sm font-medium'>
                Complete your verification to start receiving payments
            </p>

            {/* Button with gradient border */}
            <button
                onClick={handleClick}
                className='flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-r from-[#64AD5C] to-[#86E47C] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
            >
                <img
                    src='/svg/shield-icon.svg'
                    alt='Verification shield icon'
                    className='size-4'
                />
                Complete Verification
            </button>
        </div>
    );
};
