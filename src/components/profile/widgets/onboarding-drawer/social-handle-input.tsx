import { X } from '@untitled-ui/icons-react';
import { useImperativeHandle, useRef, useState } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { WidgetIcon, WidgetTypeWithIcon } from '../widget-icon';

interface HandleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The type of the widget icon to be displayed */
  type: SocialHandleInputWidgetType;
  // TODO: Fix SB not displaying this type correctly under Docs description (shows "string")
}

/**
 * SocialHandleInput is a component that allows the user to input a handle for a social media profile.
 *
 * It is a forwardRef component that allows the parent component to access the input element.
 *
 * Note: A clear button is rendered when `value` is not empty. Clicking it will cause value to be set to an empty string and is handled internally.
 * Note: Pressing enter will tab to the next input, skipping the clear button if it is shown.
 */
export const SocialHandleInput = React.forwardRef<
  HTMLInputElement,
  HandleInputProps
>(({ className, type, onChange, ...props }, ref) => {
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

  // Prevent enter from clearing the input and instead, make it tab to the next input (skipping the clear button if needed)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Simulate Tab key press
      const nextElement = e.currentTarget.form?.elements[
        Array.from(e.currentTarget.form.elements).indexOf(e.currentTarget) +
          (showClearButton ? 2 : 1)
      ] as HTMLElement;
      nextElement?.focus();
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
        onKeyDown={handleKeyDown}
        aria-label={`${type} username input`}
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
          <X className='size-4' aria-label='Clear' />
        </Button>
      )}
    </div>
  );
});
SocialHandleInput.displayName = 'HandleInput';

/** These are the supported widget types for the onboarding flow */
export const SocialHandleInputWidgetTypes = [
  'InstagramProfile',
  'TwitterProfile',
  'LinkedInProfile',
  'Github',
  'Behance',
  'Medium',
] as const satisfies WidgetTypeWithIcon[];

/** These are the supported widget types for the onboarding flow */
export type SocialHandleInputWidgetType =
  (typeof SocialHandleInputWidgetTypes)[number];

/**
 * Converts a handle and type to a widget URL.
 *
 * @param type - The type of the widget.
 * @param handle - The handle of the widget.
 * @returns The widget URL.
 */
export const typeAndHandleToWidgetUrl = (
  type: SocialHandleInputWidgetType,
  handle: string
) => {
  const baseUrl: Record<SocialHandleInputWidgetType, string> = {
    TwitterProfile: 'https://x.com/',
    InstagramProfile: 'https://instagram.com/',
    Behance: 'https://behance.net/',
    LinkedInProfile: 'https://linkedin.com/in/',
    Github: 'https://github.com/',
    Medium: 'https://medium.com/',
  };

  return `${baseUrl[type]}${handle}`;
};
