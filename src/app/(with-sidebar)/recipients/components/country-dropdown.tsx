'use client';
// data
import { countries } from 'country-data-list';
// assets
import { CheckIcon, ChevronDown, Globe } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
// utils
import { cn } from '@/lib/utils';

// Country interface
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
}

/**
 * @see https://shadcn-country-dropdown.vercel.app/
 * Modified to work for Sorbet. Could use virtual list optimization and package consolidation.
 */
const CountryDropdownComponent = (
  {
    options = countries.all.filter(
      (country: Country) =>
        country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK'
    ),
    onChange,
    defaultValue,
    value,
    disabled = false,
    placeholder = 'Select a country',
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );

  useEffect(() => {
    // Controlled mode: use value prop
    const controlledValue = value ?? defaultValue;
    if (controlledValue) {
      const initialCountry = options.find(
        (country) => country.alpha3 === controlledValue
      );
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      } else {
        // Reset selected country if value is not found
        setSelectedCountry(undefined);
      }
    } else {
      // Reset selected country if value is undefined or null
      setSelectedCountry(undefined);
    }
  }, [value, defaultValue, options]);

  const handleSelect = useCallback(
    (country: Country) => {
      console.log('🌍 CountryDropdown value: ', country);
      setSelectedCountry(country);
      onChange?.(country);
      setOpen(false);
    },
    [onChange]
  );

  const triggerClasses = cn(
    'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
    slim === true && 'w-20'
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger
        ref={ref}
        className={triggerClasses}
        disabled={disabled}
        {...props}
      >
        {selectedCountry ? (
          <div className='flex w-0 flex-grow items-center gap-2 overflow-hidden'>
            <div className='inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full'>
              <CircleFlag
                countryCode={selectedCountry.alpha2.toLowerCase()}
                height={20}
              />
            </div>
            {slim === false && (
              <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                {selectedCountry.name}
              </span>
            )}
          </div>
        ) : (
          <span>
            {slim === false ? (
              placeholder || setSelectedCountry.name
            ) : (
              <Globe size={20} />
            )}
          </span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side='bottom'
        className='min-w-[--radix-popper-anchor-width] p-0'
      >
        <Command
          className='max-h-[200px] w-full sm:max-h-[270px]'
          onWheel={(e) => e.stopPropagation()}
        >
          <CommandList>
            <div className='bg-popover sticky top-0 z-10'>
              <CommandInput placeholder='Search country...' />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option, key: number) => (
                  <CommandItem
                    className='flex w-full items-center gap-2'
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className='flex w-0 flex-grow space-x-2 overflow-hidden'>
                      <div className='inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full'>
                        <CircleFlag
                          countryCode={option.alpha2.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                        {option.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4 shrink-0',
                        option.name === selectedCountry?.name
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = 'CountryDropdownComponent';

export const CountryDropdown = forwardRef(CountryDropdownComponent);
