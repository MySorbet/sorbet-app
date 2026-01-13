'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HEARD_ABOUT_OPTIONS = [
    'Facebook',
    'LinkedIn',
    'Twitter',
    'Instagram',
    'Telegram',
    'Google Search',
    'Friend or colleague',
    'Email newsletter',
    'Online article / blog',
    'Advertisement',
    'Other',
] as const;

interface HearAboutUsProps {
    onSubmit: (selection: string | null) => void;
    isLoading?: boolean;
}

/**
 * "Where did you hear about us?" survey step
 * Users can select one option or skip
 */
export const HearAboutUs = ({
    onSubmit,
    isLoading = false,
}: HearAboutUsProps) => {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setSelected((prev) => (prev === option ? null : option));
    };

    return (
        <div className='flex flex-col gap-6'>
            {/* Header */}
            <div className='flex flex-col gap-1'>
                <h2 className='text-base font-semibold'>
                    Where did you hear about us?
                </h2>
                <p className='text-muted-foreground text-sm'>
                    Your response helps us improve our outreach. This won&apos;t affect
                    your access.
                </p>
            </div>

            {/* Options Grid */}
            <div className='flex flex-wrap gap-2'>
                {HEARD_ABOUT_OPTIONS.map((option) => {
                    const isSelected = selected === option;
                    return (
                        <button
                            key={option}
                            type='button'
                            onClick={() => handleSelect(option)}
                            disabled={isLoading}
                            className={cn(
                                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                                isSelected
                                    ? 'border-black bg-black text-white'
                                    : 'border-input hover:bg-accent hover:text-accent-foreground',
                                isLoading && 'cursor-not-allowed opacity-50'
                            )}
                        >
                            {isSelected && <Check className='h-3.5 w-3.5' />}
                            {option}
                        </button>
                    );
                })}
            </div>

            {/* Buttons */}
            <div className='flex flex-col gap-3'>
                <Button
                    onClick={() => onSubmit(selected)}
                    disabled={isLoading}
                    className='w-full'
                >
                    Continue
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => onSubmit(null)}
                    disabled={isLoading}
                    className='w-full'
                >
                    Skip
                </Button>
            </div>
        </div>
    );
};
