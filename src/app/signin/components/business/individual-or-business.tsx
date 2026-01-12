'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { OnboardingFormIndividual } from './onboarding-form-individual';
import { OnboardingFormBusiness } from './onboarding-form-business';

interface OnboardingFormData {
  customerType: 'individual' | 'business';
  fullName?: string;
  companyName?: string;
  countryName: string;
  countryCode: string;
  phoneNumber?: string;
  companyWebsite?: string;
}

interface IndividualOrBusinessProps {
  onSubmit?: (data: OnboardingFormData) => void;
  isLoading?: boolean;
}

/**
 * User decides if they are a business or individual at login,
 * then fills in the corresponding form inline
 */
export const IndividualOrBusiness = ({
  onSubmit,
  isLoading = false,
}: IndividualOrBusinessProps) => {
  const [selectedType, setSelectedType] = useState<
    'individual' | 'business' | null
  >(null);

  const handleIndividualSubmit = (data: {
    fullName: string;
    countryName: string;
    countryCode: string;
    phoneNumber?: string;
  }) => {
    onSubmit?.({
      customerType: 'individual',
      fullName: data.fullName,
      countryName: data.countryName,
      countryCode: data.countryCode,
      phoneNumber: data.phoneNumber,
    });
  };

  const handleBusinessSubmit = (data: {
    companyName: string;
    countryName: string;
    countryCode: string;
    companyWebsite: string;
  }) => {
    onSubmit?.({
      customerType: 'business',
      companyName: data.companyName,
      countryName: data.countryName,
      countryCode: data.countryCode,
      companyWebsite: data.companyWebsite,
    });
  };

  return (
    <div className='container flex w-fit items-center justify-center'>
      <div className='flex w-full max-w-lg flex-col gap-6'>
        {/* Header - Left aligned */}
        <div className='flex flex-col gap-1'>
          <h1 className='text-xl font-semibold'>What describes you best?</h1>
          <p className='text-muted-foreground text-sm'>
            It will help us setup your account properly.
          </p>
        </div>

        {/* Selection Cards */}
        <div className='flex w-full gap-3'>
          <TypeCard
            type='individual'
            title='Individual'
            description='You are a sole trader or freelancer'
            iconSrc='/svg/individual-signup-icon.svg'
            isSelected={selectedType === 'individual'}
            onClick={() => setSelectedType('individual')}
            disabled={isLoading}
          />
          <TypeCard
            type='business'
            title='Business'
            description='You are a registered company or charity'
            iconSrc='/svg/business-signup-icon.svg'
            isSelected={selectedType === 'business'}
            onClick={() => setSelectedType('business')}
            disabled={isLoading}
          />
        </div>

        {/* Inline Form */}
        {selectedType === 'individual' && (
          <div className='w-full'>
            <OnboardingFormIndividual
              onSubmit={handleIndividualSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
        {selectedType === 'business' && (
          <div className='w-full'>
            <OnboardingFormBusiness
              onSubmit={handleBusinessSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface TypeCardProps {
  type: 'individual' | 'business';
  title: string;
  description: string;
  iconSrc: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const TypeCard = ({
  title,
  description,
  iconSrc,
  isSelected,
  onClick,
  disabled = false,
}: TypeCardProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex flex-1 items-start gap-3 rounded-lg border p-4 text-left transition-colors',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-input hover:bg-accent/50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {/* Icon */}
      <div className='mt-0.5 shrink-0'>
        <Image
          src={iconSrc}
          alt=''
          width={20}
          height={20}
          className='h-5 w-5'
        />
      </div>

      {/* Content */}
      <div className='flex flex-col gap-0.5'>
        <span className='text-sm font-medium'>{title}</span>
        <span className='text-muted-foreground text-xs'>{description}</span>
      </div>
    </button>
  );
};
