import { forwardRef, useId } from 'react';

/**
 * Wrap your component in this to make it act like a file input.
 */
export const InvisibleInput = forwardRef<
  HTMLLabelElement,
  {
    children: React.ReactNode;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  }
>(({ children, handleInputChange, className, inputProps, ...props }, ref) => {
  const id = useId();
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
        type='file'
        className='hidden'
        onChange={handleInputChange}
        {...inputProps}
      />
      {children}
    </label>
  );
});

InvisibleInput.displayName = 'InvisibleInput';
