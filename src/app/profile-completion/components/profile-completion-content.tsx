'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { updateInvoicingDetails } from '@/api/invoicing';
import {
  Country,
  CountryDropdown,
} from '@/app/(with-sidebar)/recipients/components/country-dropdown';
import { CategoryDropdown } from '@/app/signin/components/business/category-dropdown';
import { getCountryRestriction } from '@/app/signin/components/business/country-restrictions';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUpdateUser } from '@/hooks';
import { User } from '@/types';

/** Returns which required fields are missing for a given user */
function getMissingFields(user: User) {
  return {
    name: !user.firstName || !user.lastName,
    country: !user.country,
    category: !user.category,
  };
}

/**
 * Profile completion form shown when a user has a customerType but is missing
 * one or more fields required for KYC (firstName, lastName, category, country).
 * Only renders inputs for the fields that are actually missing.
 */
export const ProfileCompletionContent = () => {
  const { user } = useAuth();
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState<Country | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const missing = user ? getMissingFields(user) : null;
  const restrictionInfo = country ? getCountryRestriction(country.alpha3) : null;

  // Redirect unauthenticated users to sign in
  useEffect(() => {
    if (ready && !authenticated) {
      router.replace('/signin');
    }
  }, [ready, authenticated, router]);

  // Redirect users who don't need to be here (profile already complete)
  useEffect(() => {
    if (missing && !missing.name && !missing.country && !missing.category) {
      router.replace('/dashboard');
    }
  }, [missing, router]);

  const isValid =
    (!missing?.name || fullName.trim() !== '') &&
    (!missing?.country || country !== null) &&
    (!missing?.category || category !== null);

  const { mutate: updateUser, isPending } = useUpdateUser({
    toastOnSuccess: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !missing || !isValid) return;

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || undefined;
    const lastName = nameParts.slice(1).join(' ') || undefined;

    updateUser(
      {
        id: user.id,
        ...(missing.name && { firstName, lastName }),
        ...(missing.country && country && { country: country.name }),
        ...(missing.category && category && { category }),
      },
      {
        onSuccess: async () => {
          if (missing.country && country) {
            try {
              await updateInvoicingDetails(user.id, { country: country.alpha2 });
            } catch {
              // Silent fail — invoicing details are not critical here
            }
          }
          router.replace('/dashboard');
        },
      }
    );
  };

  if (!user || !missing) {
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-8' />
      </div>
    );
  }

  return (
    <div className='container flex w-fit items-center justify-center'>
      <div className='flex w-full max-w-lg flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-xl font-semibold'>Update your profile</h1>
          <p className='text-muted-foreground text-sm'>
            We have recently updated our privacy policy and require you to
            update your profile before you can use your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {missing.name && (
            <div className='flex flex-col gap-2'>
              <Label htmlFor='fullName'>Full name</Label>
              <Input
                id='fullName'
                type='text'
                placeholder='E.g John Snow'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isPending}
              />
            </div>
          )}

          {missing.country && (
            <div className='flex flex-col gap-2'>
              <Label htmlFor='country'>Country of residence</Label>
              <CountryDropdown
                onChange={setCountry}
                value={country?.alpha3}
                disabled={isPending}
                placeholder='Select a country'
              />
              {restrictionInfo?.message && (
                <div className='flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700'>
                  <Info className='mt-0.5 h-4 w-4 shrink-0' />
                  <p>{restrictionInfo.message}</p>
                </div>
              )}
            </div>
          )}

          {missing.category && (
            <div className='flex flex-col gap-2'>
              <Label htmlFor='category'>
                {user.customerType === 'business'
                  ? 'Business category'
                  : 'Employment status'}
              </Label>
              <CategoryDropdown
                categoryType={user.customerType ?? 'individual'}
                onChange={(cat) => setCategory(cat.code)}
                value={category ?? undefined}
                disabled={isPending}
                placeholder={
                  user.customerType === 'business'
                    ? 'Select your business category'
                    : 'Select your employment status'
                }
              />
            </div>
          )}

          <Button
            type='submit'
            disabled={!isValid || isPending}
            className='mt-2 w-full'
          >
            {isPending && <Spinner />}
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};
