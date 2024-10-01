import { X } from '@untitled-ui/icons-react';
import { useImperativeHandle, useRef, useState } from 'react';
import React from 'react';

import { HandleInput } from '@/components/profile/widgets/onboarding-drawer/handle-input';
import { Button } from '@/components/ui/button';

import { WidgetIcon, WidgetTypeWithIcon } from '../widget-icon';

interface HandleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The type of the widget icon to be displayed */
  type: OnboardHandleInputWidgetType;
  // TODO: Fix SB not displaying this type correctly under Docs description (shows "string")
}

/**
 * HandleInput is a component that allows the user to input a handle for a social media profile.
 *
 * It is a forwardRef component that allows the parent component to access the input element.
 *
 * Note: A clear button is rendered when `value` is not empty. Clicking it will cause value to be set to an empty string and is handled internally.
 * Note: Pressing enter will tab to the next input, skipping the clear button if it is shown.
 */
export const OnboardHandleInput = React.forwardRef<
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

  return (
    <div className='relative'>
      <HandleInput
        showClearButton={showClearButton}
        setShowClearButton={setShowClearButton}
        localRef={localRef}
        onChange={onChange}
        type={type}
        className={className}
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
OnboardHandleInput.displayName = 'HandleInput';

/** These are the supported widget types for the onboarding flow */
export const OnboardHandleInputWidgetTypes = [
  'InstagramProfile',
  'TwitterProfile',
  'LinkedInProfile',
  'Github',
  'Behance',
  'Medium',
] as const satisfies WidgetTypeWithIcon[];

/** These are the supported widget types for the onboarding flow */
export type OnboardHandleInputWidgetType =
  (typeof OnboardHandleInputWidgetTypes)[number];

/**
 * Converts a handle and type to a widget URL.
 *
 * @param type - The type of the widget.
 * @param handle - The handle of the widget.
 * @returns The widget URL.
 */
export const typeAndHandleToWidgetUrl = (
  type: OnboardHandleInputWidgetType,
  handle: string
) => {
  const baseUrl: Record<OnboardHandleInputWidgetType, string> = {
    TwitterProfile: 'https://x.com/',
    InstagramProfile: 'https://instagram.com/',
    Behance: 'https://behance.net/',
    LinkedInProfile: 'https://linkedin.com/in/',
    Github: 'https://github.com/',
    Medium: 'https://medium.com/',
  };

  return `${baseUrl[type]}${handle}`;
};
