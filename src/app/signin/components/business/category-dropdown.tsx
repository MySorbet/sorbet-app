'use client';

import { CheckIcon, ChevronDown } from 'lucide-react';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';

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
import { cn } from '@/lib/utils';

import { Category, getAllCategories } from './categories';

interface CategoryDropdownProps {
    categoryType: 'individual' | 'business';
    onChange?: (category: Category) => void;
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    placeholder?: string;
}

/**
 * Category dropdown component for selecting employment status (individual) or business category (business)
 * Consistent styling with CountryDropdown component
 */
const CategoryDropdownComponent = (
    {
        categoryType,
        onChange,
        defaultValue,
        value,
        disabled = false,
        placeholder = 'Select a category',
        ...props
    }: CategoryDropdownProps,
    ref: React.ForwardedRef<HTMLButtonElement>
) => {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Category | undefined
    >(undefined);

    const options = getAllCategories(categoryType);

    useEffect(() => {
        // Controlled mode: use value prop
        const controlledValue = value ?? defaultValue;
        if (controlledValue) {
            const initialCategory = options.find(
                (category) => category.code === controlledValue
            );
            if (initialCategory) {
                setSelectedCategory(initialCategory);
            } else {
                // Reset selected category if value is not found
                setSelectedCategory(undefined);
            }
        } else {
            // Reset selected category if value is undefined or null
            setSelectedCategory(undefined);
        }
    }, [value, defaultValue, options]);

    const handleSelect = useCallback(
        (category: Category) => {
            setSelectedCategory(category);
            onChange?.(category);
            setOpen(false);
        },
        [onChange]
    );

    const triggerClasses = cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
    );

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger
                ref={ref}
                className={triggerClasses}
                disabled={disabled}
                {...props}
            >
                {selectedCategory ? (
                    <div className='flex w-0 flex-grow items-center gap-2 overflow-hidden'>
                        <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                            {selectedCategory.label}
                        </span>
                    </div>
                ) : (
                    <span className='text-muted-foreground'>{placeholder}</span>
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
                            <CommandInput placeholder='Search category...' />
                        </div>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option, key: number) => (
                                <CommandItem
                                    className='flex w-full items-center gap-2'
                                    key={key}
                                    onSelect={() => handleSelect(option)}
                                >
                                    <div className='flex w-0 flex-grow space-x-2 overflow-hidden'>
                                        <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                            {option.label}
                                        </span>
                                    </div>
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto h-4 w-4 shrink-0',
                                            option.code === selectedCategory?.code
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

CategoryDropdownComponent.displayName = 'CategoryDropdownComponent';

export const CategoryDropdown = forwardRef(CategoryDropdownComponent);
