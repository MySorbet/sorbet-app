import { forwardRef, useId } from 'react';

/**
 * Wrap your component in this to make it act like a file input.
 *
 * Note: This component will clear the file input value after it calls `handleInputChange`.
 */
export const InvisibleInput = forwardRef<
  HTMLLabelElement,
  {
    children: React.ReactNode;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  }
>(
  (
    { children, handleInputChange, className, inputProps, disabled, ...props },
    ref
  ) => {
    const id = useId();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange?.(e);
      e.target.value = '';
    };
    return (
      <label
        ref={ref}
        htmlFor={id}
        tabIndex={0}
        onKeyDown={(e) => {
          e.key === 'Enter' && e.currentTarget.click();
        }}
        className={className}
        {...props}
      >
        <input
          id={id}
          disabled={disabled}
          type='file'
          className='hidden'
          onChange={handleChange}
          {...inputProps}
        />
        {children}
      </label>
    );
  }
);

InvisibleInput.displayName = 'InvisibleInput';
