import { X } from '@untitled-ui/icons-react';
import { useImperativeHandle, useRef, useState } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { WidgetIcon, WidgetTypeWithIcon } from '../widget-icon';

interface HandleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The type of the widget icon to be displayed */
  type: HandleInputWidgetType;
}

/**
 * HandleInput is a component that allows the user to input a handle for a social media profile.
 *
 * It is a forwardRef component that allows the parent component to access the input element.
 */
export const HandleInput = React.forwardRef<HTMLInputElement, HandleInputProps>(
  ({ className, type, onChange, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const [showClearButton, setShowClearButton] = useState(false);

    // TODO: Can we do without this non-null assertion?
    useImperativeHandle(ref, () => localRef.current!);

    const clearInput = () => {
      if (localRef.current) {
        localRef.current.value = '';
        const event = new Event('input', { bubbles: true });
        localRef.current.dispatchEvent(event);
        setShowClearButton(false);

        // Call the onChange handler to update the external state
        onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className='relative'>
        <Input
          type='text'
          // TODO: Keep the @ when user types
          placeholder='@username'
          className={cn('truncate pl-9 pr-10 shadow-sm', className)}
          ref={localRef}
          onChange={(e) => {
            setShowClearButton(e.target.value.length > 0);
            onChange?.(e);
          }}
          {...props}
        />
        <div className='absolute left-2 top-1/2 -translate-y-1/2 transform'>
          <WidgetIcon type={type} className='mb-0 size-6' />
        </div>
        {showClearButton && (
          <Button
            variant='ghost'
            onClick={clearInput}
            className='absolute right-2 top-1/2 h-fit -translate-y-1/2 transform p-1 text-gray-500'
          >
            <X className='size-4' />
          </Button>
        )}
      </div>
    );
  }
);
HandleInput.displayName = 'HandleInput';

/** These are the supported widget types for the onboarding flow */
export const HandleInputWidgetTypes = [
  'InstagramProfile',
  'TwitterProfile',
  'LinkedInProfile',
  'Github',
  'Dribbble',
  'Behance',
  'Medium',
] as const satisfies WidgetTypeWithIcon[];

// TODO: Figure out why SB can't infer this type for controls
export type HandleInputWidgetType = (typeof HandleInputWidgetTypes)[number];
// export type HandleInputWidgetType =
//   | 'InstagramProfile'
//   | 'TwitterProfile'
//   | 'LinkedInProfile'
//   | 'Github'
//   | 'Dribbble'
//   | 'Behance'
//   | 'Medium';
