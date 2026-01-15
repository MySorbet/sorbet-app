'use client';

import { cn } from '@/lib/utils';

/**
 * Banner displayed for users from countries restricted from USD and EUR accounts.
 * Shows a purple gradient with globe illustration.
 */
export const RestrictedCountryBanner = ({
    className,
}: {
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'relative flex items-center justify-between gap-4 overflow-hidden rounded-lg border border-border p-4 shadow-sm',
                'bg-gradient-to-r from-white to-[#F8F1FF]/50',
                className
            )}
        >
            {/* Content */}
            <div className='flex flex-col gap-1 pr-20 sm:pr-24'>
                <h3 className='text-sm font-semibold sm:text-base'>
                    Access to USD & EUR Accounts Currently Limited
                </h3>
                <p className='text-muted-foreground text-xs sm:text-sm'>
                    USD and EUR accounts are currently unavailable for users in certain
                    countries. You can still use Sorbet to receive and manage USDC
                    payments.
                </p>
            </div>

            {/* Globe illustration - positioned on the right */}
            <div className='absolute right-0 top-1/2 h-full w-24 -translate-y-1/2 sm:w-28'>
                <img
                    src='/svg/purple-globe.svg'
                    alt=''
                    className='h-full w-full object-contain object-right'
                    aria-hidden='true'
                />
            </div>
        </div>
    );
};
