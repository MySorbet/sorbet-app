'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CustomerStatus } from '@/types/bridge';

import { TaskStatuses } from './checklist-card';
import { DashboardCard } from './dashboard-card';

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
  loading,
}: {
  className?: string;
  completedTasks?: TaskStatuses;
  onVerifyClick?: () => void;
  kycStatus?: CustomerStatus;
  loading?: boolean;
}) => {
  const router = useRouter();

  const handleVerifyClick = () => {
    if (onVerifyClick) {
      onVerifyClick();
    } else {
      router.push('/verify');
    }
  };

  // Logic for step 2 badge and behavior
  let step2Badge = 'Verify now';
  let step2BadgeColor = 'bg-[#5864FF]'; // Default blue
  let step2IndicatorColor = 'border-sorbet';
  let step2Clickable = true;
  let step2Completed = false;
  let step2Verifying = false;

  if (kycStatus === 'under_review') {
    step2Badge = 'Verifying';
    step2BadgeColor = 'bg-[#FF9933]';
    step2IndicatorColor = 'border-[#FF9933]';
    step2Clickable = true;
    step2Verifying = true;
  } else if (kycStatus === 'active') {
    step2Badge = 'Verified';
    step2BadgeColor = 'bg-gradient-to-r from-[#64AD5C] to-[#86E47C]';
    step2IndicatorColor = 'border-sorbet';
    step2Clickable = true;
    step2Completed = true;
  } else if (kycStatus === 'incomplete') {
    step2Badge = 'Incomplete Verification';
    step2BadgeColor = 'bg-[#FF383C]';
    step2IndicatorColor = 'border-sorbet';
    step2Clickable = true;
  } else if (kycStatus === 'rejected') {
    step2Badge = 'Verify now';
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
      description: 'Get verified via Persona',
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
      handleVerifyClick();
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
            <div
              key={i}
              className='flex flex-1 items-start gap-4 lg:flex-col lg:items-center'
            >
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
        <h3 className='text-xl font-semibold leading-none text-gray-900'>
          Let&apos;s Get You Set Up
        </h3>
        <span className='text-sm font-medium text-gray-500'>
          {Math.min(currentStep + 1, steps.length)}/{steps.length}
        </span>
      </div>

      {/* Stepper Container */}
      <div className='relative flex flex-col gap-8 lg:block lg:gap-0'>
        {/* Progress Lines - Mobile/Tablet Only (Vertical) */}
        <div className='absolute bottom-6 left-3 top-6 w-[2px] -translate-x-1/2 lg:hidden'>
          {/* Background Line (Gray) */}
          <div className='absolute inset-0 bg-gray-200' />

          {/* Active Progress Line (Purple) */}
          <div
            className='bg-sorbet absolute left-0 top-0 w-full transition-all duration-300'
            style={{ height: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        {/* Progress Lines - Desktop Only (Horizontal) */}
        <div className='hidden lg:block'>
          <div className='absolute left-[16.66%] right-[16.66%] top-3 h-[2px] -translate-y-1/2'>
            {/* Background Line (Gray) */}
            <div className='absolute inset-0 bg-gray-200' />

            {/* Active Progress Line (Purple) */}
            <div
              className='bg-sorbet absolute left-0 top-0 h-full transition-all duration-300'
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Steps Container - Grid on desktop to space evenly */}
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0'>
          {steps.map((step) => {
            const isCompleted = step.completed;
            const isActive = step.active;
            const isVerifying = step.verifying;

            return (
              <div
                key={step.id}
                className={cn(
                  'group flex items-start gap-4 lg:flex-1 lg:flex-col lg:items-center lg:gap-0 lg:text-center',
                  step.clickable ? 'cursor-pointer' : 'cursor-default'
                )}
                onClick={() => handleStepClick(step)}
                role='button'
              >
                {/* Circle Indicator */}
                <div
                  className={cn(
                    'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-white transition-colors duration-300',
                    isCompleted && 'border-sorbet bg-sorbet border-2',
                    isVerifying && 'border-2 border-white bg-white',
                    isActive &&
                      cn(
                        'border-2 bg-white',
                        step.indicatorColor || 'border-sorbet'
                      ),
                    !isActive &&
                      !isCompleted &&
                      !isVerifying &&
                      'border-2 border-gray-200 bg-white'
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
                        step.indicatorColor?.replace('border-', 'bg-') ||
                          'bg-sorbet'
                      )}
                    />
                  ) : (
                    <div className='h-1.5 w-1.5 rounded-full bg-gray-200' />
                  )}
                </div>

                {/* Text Labels */}
                <div className='flex flex-col lg:mt-3 lg:items-center'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold text-gray-900 lg:whitespace-nowrap'>
                      {step.title}
                    </span>
                    {/* Badge - Desktop */}
                    {step.badge && (
                      <span
                        className={cn(
                          'hidden rounded px-1.5 py-0.5 text-[10px] font-medium text-white lg:inline-block',
                          step.badgeColor || 'bg-[#5864FF]'
                        )}
                      >
                        {step.badge}
                      </span>
                    )}
                  </div>

                  {/* Badge - Mobile/Tablet */}
                  {step.badge && (
                    <span
                      className={cn(
                        'mt-1 inline-block w-fit rounded px-1.5 py-0.5 text-[10px] font-medium text-white lg:hidden',
                        step.badgeColor || 'bg-[#5864FF]'
                      )}
                    >
                      {step.badge}
                    </span>
                  )}

                  <span className='mt-0.5 text-xs text-gray-500 lg:mt-1 lg:whitespace-nowrap'>
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
};
