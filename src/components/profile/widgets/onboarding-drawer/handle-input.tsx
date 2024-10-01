import {
  ChangeEventHandler,
  Dispatch,
  Ref,
  SetStateAction,
} from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HandleInputProps {
  setShowClearButton?: Dispatch<SetStateAction<boolean>>;
  showClearButton?: boolean;
  className?: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined
  type?: string;
  localRef?: Ref<HTMLInputElement>;
}

/**
 * This component is the component for the input, that's it.
 * * Not to be confused for OnboardHandleInput (renamed from HandleInput)
 * @returns an input that has an associated handler
 */
export const HandleInput = ({
  showClearButton,
  setShowClearButton,
  className,
  localRef,
  onChange,
  type,
  ...props
}: HandleInputProps) => {
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
    <Input
      type='text'
      // TODO: Keep the @ when user types
      placeholder='@username'
      className={cn('truncate pl-9 pr-10 shadow-sm', className)}
      ref={localRef}
      onChange={(e) => {
        setShowClearButton?.(e.target.value.length > 0);
        onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      aria-label={`${type} username input`}
      {...props}
    />
  );
};
