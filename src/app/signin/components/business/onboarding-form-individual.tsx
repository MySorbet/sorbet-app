'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

import {
    CountryDropdown,
    Country,
} from '@/app/(with-sidebar)/recipients/components/country-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { getCountryRestriction } from './country-restrictions';

interface OnboardingFormIndividualProps {
    onSubmit: (data: {
        fullName: string;
        countryName: string;
        countryCode: string;
        phoneNumber?: string;
    }) => void;
    isLoading?: boolean;
}

/**
 * Onboarding form for Individual users
 * Collects: Full Name (required), Country of Residence (required), Phone Number (optional)
 */
export const OnboardingFormIndividual = ({
    onSubmit,
    isLoading = false,
}: OnboardingFormIndividualProps) => {
    const [fullName, setFullName] = useState('');
    const [country, setCountry] = useState<Country | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    const isValid = fullName.trim() !== '' && country !== null;

    // Get country restriction info
    const restrictionInfo = country
        ? getCountryRestriction(country.alpha3)
        : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !country) return;

        onSubmit({
            fullName: fullName.trim(),
            countryName: country.name,
            countryCode: country.alpha2,
            phoneNumber: phoneNumber.trim() || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {/* Full Name */}
            <div className='flex flex-col gap-2'>
                <Label htmlFor='fullName'>Full name</Label>
                <Input
                    id='fullName'
                    type='text'
                    placeholder='E.g John Snow'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Country of Residence */}
            <div className='flex flex-col gap-2'>
                <Label htmlFor='country'>Country of residence</Label>
                <CountryDropdown
                    onChange={setCountry}
                    value={country?.alpha3}
                    disabled={isLoading}
                    placeholder='Select a country'
                />
                {/* Country restriction warning */}
                {restrictionInfo?.message && (
                    <div className='flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700'>
                        <Info className='mt-0.5 h-4 w-4 shrink-0' />
                        <p>{restrictionInfo.message}</p>
                    </div>
                )}
            </div>

            {/* Phone Number (Optional) */}
            <div className='flex flex-col gap-2'>
                <Label htmlFor='phoneNumber'>Phone Number (Optional)</Label>
                <Input
                    id='phoneNumber'
                    type='tel'
                    placeholder='E.g +97123412345'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Submit Button */}
            <Button
                type='submit'
                disabled={!isValid || isLoading}
                className='mt-2 w-full'
            >
                Continue
            </Button>
        </form>
    );
};
