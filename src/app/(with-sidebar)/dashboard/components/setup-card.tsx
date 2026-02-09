'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateDueCustomer } from '@/hooks/profile/use-create-due-customer';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';

import { TaskStatuses } from './checklist-card';
import { DashboardCard } from './dashboard-card';

/** Build full Due URL from a relative path */
const buildDueUrl = (path?: string) => {
    if (!path) return undefined;
    try {
        return new URL(path, env.NEXT_PUBLIC_DUE_BASE_URL).toString();
    } catch {
        return path;
    }
};

type SetupStep = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    active?: boolean;
    verifying?: boolean;
    badge?: string;
    badgeColor?: string;
    clickable?: boolean;
    indicatorColor?: string;
};

/**
 * "Let's Get You Set Up" stepper card for unrestricted unverified users.
 * Shows progress through onboarding steps with horizontal layout on desktop
 * and vertical layout on mobile.
 */
export const SetupCard = ({
    className,
    completedTasks,
    onVerifyClick,
    kycStatus,
    tosStatus,
    loading,
    layout = 'horizontal',
    tosLink,
    kycLink,
    showInlineVerification = false,
}: {
    className?: string;
    completedTasks?: TaskStatuses;
    onVerifyClick?: () => void;
    kycStatus?: string;
    tosStatus?: string;
    loading?: boolean;
    layout?: 'horizontal' | 'vertical';
    tosLink?: string;
    kycLink?: string;
    showInlineVerification?: boolean;
}) => {
    const router = useRouter();

    const { mutate: createDueCustomer, isPending: isCreatingDueCustomer } = useCreateDueCustomer({
        onSuccess: (dueCustomer) => {
            // After creating the Due customer, immediately open the appropriate link
            const account = dueCustomer.account;
            const tosStatus = account.tos?.status;
            
            // If TOS is not yet accepted, open TOS link first
            if (tosStatus !== 'accepted') {
                const newTosLink = buildDueUrl(account.tos?.link);
                if (newTosLink) {
                    window.open(newTosLink, '_blank', 'noopener,noreferrer');
                }
            } else {
                // TOS already accepted, open KYC link
                const newKycLink = buildDueUrl(account.kyc?.link);
                if (newKycLink) {
                    window.open(newKycLink, '_blank', 'noopener,noreferrer');
                }
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to start verification');
        },
    });

    const handleVerifyClick = () => {
        if (onVerifyClick) {
            onVerifyClick();
        } else {
            router.push('/verify');
        }
    };

    const handleStartVerification = () => {
        if (!kycStatus) {
            // No account yet, create one (the onSuccess callback will open the link)
            createDueCustomer();
        } else if (tosStatus !== 'accepted' && tosLink) {
            // Account exists but TOS not accepted yet, open TOS link
            window.open(tosLink, '_blank', 'noopener,noreferrer');
        } else if (kycLink) {
            // TOS accepted, open KYC link
            window.open(kycLink, '_blank', 'noopener,noreferrer');
        } else {
            handleVerifyClick();
        }
    };

    // Logic for step 2 badge and behavior
    let step2Badge = 'Start verification';
    let step2BadgeColor = 'bg-[#5864FF]'; // Default blue
    let step2IndicatorColor = 'border-sorbet';
    let step2Clickable = true;
    let step2Completed = false;
    let step2Verifying = false;

    // Show loading state while creating Due customer
    if (isCreatingDueCustomer) {
        step2Badge = 'Creating account...';
        step2BadgeColor = 'bg-[#5864FF]';
        step2Clickable = false;
    } else if (kycStatus === 'under_review' || kycStatus === 'in_review') {
        // Actually being reviewed
        step2Badge = 'Verifying';
        step2BadgeColor = 'bg-[#FF9933]';
        step2IndicatorColor = 'border-[#FF9933]';
        step2Clickable = true;
        step2Verifying = true;
    } else if (kycStatus === 'approved' || kycStatus === 'passed') {
        // Approved
        step2Badge = 'Account Verified';
        step2BadgeColor = 'bg-gradient-to-r from-[#64AD5C] to-[#86E47C]';
        step2IndicatorColor = 'border-sorbet';
        step2Clickable = true;
        step2Completed = true;
    } else if (kycStatus === 'failed' || kycStatus === 'rejected') {
        // Failed - allow retry
        step2Badge = 'Verify now';
        step2BadgeColor = 'bg-[#FF383C]';
        step2IndicatorColor = 'border-sorbet';
        step2Clickable = true;
    } else if (kycStatus === 'pending') {
        // Account created but KYC not started yet
        step2Badge = 'Start verification';
        step2BadgeColor = 'bg-[#5864FF]';
        step2IndicatorColor = 'border-sorbet';
        step2Clickable = true;
    }

    // Define the setup steps
    const steps: SetupStep[] = [
        {
            id: 'account',
            title: 'Create your account',
            description: 'Setup your business or individual account',
            completed: true,
            clickable: false,
        },
        {
            id: 'verify',
            title: 'Unlock virtual accounts',
            description: 'Get verified & accept banking payments',
            completed: step2Completed,
            verifying: step2Verifying,
            active: !step2Completed && !step2Verifying,
            badge: step2Badge,
            badgeColor: step2BadgeColor,
            indicatorColor: step2IndicatorColor,
            clickable: step2Clickable,
        },
        {
            id: 'invoice',
            title: 'Send first invoice',
            description: 'Create your 1st invoice & get paid!',
            completed: completedTasks?.invoice ?? false,
            active: step2Completed && !completedTasks?.invoice,
            clickable: step2Completed, // Can click to create invoice if verified
        },
    ];

    // Calculate current step index (0, 1, or 2)
    let currentStep = 1;
    if (step2Completed) {
        currentStep = 2;
        if (completedTasks?.invoice) {
            currentStep = 3;
        }
    }

    const handleStepClick = (step: SetupStep) => {
        if (!step.clickable) return;

        if (step.id === 'verify') {
            // If inline verification is enabled, handle verification directly
            // This includes creating a Due account if none exists yet
            if (showInlineVerification) {
                handleStartVerification();
            } else {
                handleVerifyClick();
            }
        } else if (step.id === 'invoice') {
            router.push('/invoices/create');
        }
    };

    if (loading) {
        return (
            <DashboardCard className={cn('space-y-8 p-6', className)}>
                <div className='flex items-baseline space-x-2'>
                    <Skeleton className='h-6 w-48' />
                    <Skeleton className='h-4 w-10' />
                </div>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='flex flex-1 items-start gap-4 lg:flex-col lg:items-center'>
                            <Skeleton className='h-6 w-6 rounded-full' />
                            <div className='flex flex-col gap-2 lg:items-center'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-3 w-40' />
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        );
    }

    // Visual adjustment for progress bar width
    const progressPercentage = (currentStep / (steps.length - 1)) * 100;

    return (
        <DashboardCard className={cn('space-y-8 p-6', className)}>
            {/* Header */}
            <div className='flex items-baseline space-x-2'>
                <h3 className='text-xl font-semibold leading-none text-gray-900'>Let&apos;s Get You Set Up</h3>
                <span className='text-sm font-medium text-gray-500'>
                    {Math.min(currentStep + 1, steps.length)}/{steps.length}
                </span>
            </div>

            {/* Stepper Container */}
            <div className={cn(
                'relative flex flex-col gap-8',
                layout === 'horizontal' ? 'lg:block lg:gap-0' : ''
            )}>
                {/* Progress Lines - Vertical */}
                <div className={cn(
                    'absolute left-3 top-6 bottom-6 w-[2px] -translate-x-1/2',
                    layout === 'horizontal' ? 'lg:hidden' : ''
                )}>
                    {/* Background Line (Gray) */}
                    <div className='absolute inset-0 bg-gray-200' />

                    {/* Active Progress Line (Purple) */}
                    <div
                        className='absolute left-0 top-0 w-full transition-all duration-300 bg-sorbet'
                        style={{ height: `${Math.min(progressPercentage, 100)}%` }}
                    />
                </div>

                {/* Progress Lines - Desktop Only (Horizontal) */}
                {layout === 'horizontal' && (
                <div className='hidden lg:block'>
                    <div className='absolute left-[16.66%] right-[16.66%] top-3 h-[2px] -translate-y-1/2'>
                        {/* Background Line (Gray) */}
                        <div className='absolute inset-0 bg-gray-200' />

                        {/* Active Progress Line (Purple) */}
                        <div
                            className='absolute left-0 top-0 h-full transition-all duration-300 bg-sorbet'
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                </div>
                )}

                {/* Steps Container - Grid on desktop to space evenly */}
                <div className={cn(
                    'flex flex-col gap-6',
                    layout === 'horizontal' ? 'lg:flex-row lg:items-start lg:gap-0' : ''
                )}>
                    {steps.map((step) => {
                        const isCompleted = step.completed;
                        const isActive = step.active;
                        const isVerifying = step.verifying;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    'group flex items-start gap-4',
                                    layout === 'horizontal' ? 'lg:flex-1 lg:flex-col lg:items-center lg:gap-0 lg:text-center' : '',
                                    step.clickable ? 'cursor-pointer' : 'cursor-default'
                                )}
                                onClick={() => handleStepClick(step)}
                                role='button'
                            >
                                {/* Circle Indicator */}
                                <div
                                    className={cn(
                                        'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-white transition-colors duration-300',
                                        isCompleted && 'border-2 border-sorbet bg-sorbet',
                                        isVerifying && 'border-2 border-white bg-white',
                                        isActive && cn('border-2 bg-white', step.indicatorColor || 'border-sorbet'),
                                        !isActive && !isCompleted && !isVerifying && 'border-2 border-gray-200 bg-white'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className='h-3 w-3 text-white' />
                                    ) : isVerifying ? (
                                        <img
                                            src='/svg/checklist-loader.svg'
                                            alt='Verifying'
                                            className='h-8 w-8 animate-spin'
                                        />
                                    ) : isActive ? (
                                        <div
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full',
                                                step.indicatorColor?.replace('border-', 'bg-') || 'bg-sorbet'
                                            )}
                                        />
                                    ) : (
                                        <div className='h-1.5 w-1.5 rounded-full bg-gray-200' />
                                    )}
                                </div>

                                {/* Text Labels */}
                                <div className={cn(
                                    'flex flex-1 flex-col',
                                    layout === 'horizontal' ? 'lg:mt-3 lg:items-center' : ''
                                )}>
                                    <div className='flex items-center justify-between gap-3'>
                                        <div className='flex items-center gap-2'>
                                            <span className={cn(
                                                'text-sm font-semibold text-gray-900',
                                                layout === 'horizontal' ? 'lg:whitespace-nowrap' : ''
                                            )}>
                                                {step.title}
                                            </span>
                                            {/* Badge - Only show in horizontal layout on desktop when NOT using inline verification */}
                                            {step.badge && layout === 'horizontal' && !showInlineVerification && (
                                                <span
                                                    className={cn(
                                                        'hidden rounded px-1.5 py-0.5 text-[10px] font-medium text-white lg:inline-block',
                                                        step.badgeColor || 'bg-[#5864FF]'
                                                    )}
                                                >
                                                    {step.badge}
                                                </span>
                                            )}
                                            {/* Badge - Show in vertical layout or mobile when NOT using inline verification */}
                                            {step.badge && layout === 'vertical' && !showInlineVerification && (
                                                <span
                                                    className={cn(
                                                        'inline-block rounded px-1.5 py-0.5 text-[10px] font-medium text-white',
                                                        step.badgeColor || 'bg-[#5864FF]'
                                                    )}
                                                >
                                                    {step.badge}
                                                </span>
                                            )}
                                        </div>

                                        {/* Button - Show when using inline verification (verify page only) - aligned to the right */}
                                        {step.badge && showInlineVerification && step.id === 'verify' && (
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className={cn(
                                                    'h-9 shrink-0 rounded-full px-5 text-sm font-medium',
                                                    isCompleted && 'bg-[#DFFFD4] text-[#085100] hover:!bg-[#DFFFD4] hover:!text-[#085100]',
                                                    isVerifying && 'bg-[#FFE7CF] text-[#FF5405] hover:!bg-[#FFE7CF] hover:!text-[#FF5405]',
                                                    (kycStatus === 'failed' || kycStatus === 'rejected') && 'bg-[#FFE5E6] text-[#E20C0F] hover:!bg-[#FFE5E6] hover:!text-[#E20C0F]',
                                                    !isCompleted && !isVerifying && kycStatus !== 'failed' && kycStatus !== 'rejected' && 'bg-[#D9EFFF] text-[#00508A] hover:!bg-[#C5E7FF] hover:!text-[#00508A]'
                                                )}
                                                disabled={isCreatingDueCustomer || !step.clickable}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStepClick(step);
                                                }}
                                            >
                                                {step.badge}
                                            </Button>
                                        )}
                                    </div>

                                    {/* Badge - Mobile/Tablet (only in horizontal mode) when NOT using inline verification */}
                                    {step.badge && layout === 'horizontal' && !showInlineVerification && (
                                        <span
                                            className={cn(
                                                'mt-1 inline-block w-fit rounded px-1.5 py-0.5 text-[10px] font-medium text-white lg:hidden',
                                                step.badgeColor || 'bg-[#5864FF]'
                                            )}
                                        >
                                            {step.badge}
                                        </span>
                                    )}

                                    <span className={cn(
                                        'mt-0.5 text-xs text-gray-500',
                                        layout === 'horizontal' ? 'lg:mt-1 lg:whitespace-nowrap' : ''
                                    )}>
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Completion Card - Only show in vertical layout when verified AND invoice not created */}
            {layout === 'vertical' && step2Completed && !completedTasks?.invoice && (
                <div className='rounded-lg border border-gray-200 bg-white p-6'>
                    <div className='flex items-start gap-3'>
                        <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100'>
                            <Check className='h-4 w-4 text-green-600' />
                        </div>
                        <div className='flex-1 space-y-3'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900'>Account verified</h3>
                                <p className='mt-1 text-sm text-gray-600'>
                                    Congrats! You can now accept bank payments. Try sending an invoice to test it out.
                                </p>
                            </div>
                            <Button
                                variant='sorbet'
                                onClick={() => router.push('/invoices/create')}
                                className='w-fit'
                            >
                                Create your first invoice
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardCard>
    );
};
