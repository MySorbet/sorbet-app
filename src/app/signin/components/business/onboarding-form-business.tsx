'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';

import {
    Country,
    CountryDropdown,
} from '@/app/(with-sidebar)/recipients/components/country-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { CategoryDropdown } from './category-dropdown';
import { getCountryRestriction } from './country-restrictions';

interface OnboardingFormBusinessProps {
    onSubmit: (data: {
        companyName: string;
        countryName: string;
        countryCode: string;
        category: string;
        companyWebsite: string;
    }) => void;
    isLoading?: boolean;
}

/**
 * Onboarding form for Business users
 * Collects: Company Name (required), Country of Residence (required), Company Website (required)
 */
export const OnboardingFormBusiness = ({
    onSubmit,
    isLoading = false,
}: OnboardingFormBusinessProps) => {
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState<Country | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [companyWebsite, setCompanyWebsite] = useState('');

    // Get country restriction info
    const restrictionInfo = country
        ? getCountryRestriction(country.alpha3)
        : null;

    const isValid =
        companyName.trim() !== '' &&
        country !== null &&
        category !== null &&
        companyWebsite.trim() !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || !country || !category) return;

        onSubmit({
            companyName: companyName.trim(),
            countryName: country.name,
            countryCode: country.alpha2,
            category,
            companyWebsite: companyWebsite.trim(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {/* Company Name */}
            <div className='flex flex-col gap-2'>
                <Label htmlFor='companyName'>Your company name</Label>
                <Input
                    id='companyName'
                    type='text'
                    placeholder='E.g Salt Consulting'
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
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

            {/* Business Category */}
            <div className='flex flex-col gap-2'>
                <Label htmlFor='category'>Business category</Label>
                <CategoryDropdown
                    categoryType='business'
                    onChange={(cat) => setCategory(cat.code)}
                    value={category || undefined}
                    disabled={isLoading}
                    placeholder='Select your business category'
                />
            </div>

            {/* Company Website */}
            <div className='flex flex-col gap-2'>
                <Label htmlFor='companyWebsite'>Company Website</Label>
                <Input
                    id='companyWebsite'
                    type='text'
                    placeholder='www.saltconsulting.com'
                    prefix='https://'
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
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
