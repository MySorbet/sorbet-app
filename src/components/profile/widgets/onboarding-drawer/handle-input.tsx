import { CircleAlert, CircleCheck } from 'lucide-react';
import { ChangeEvent, ComponentProps } from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HandleInputProps<T extends FieldValues>
  extends ComponentProps<'input'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  error: FieldError | undefined;
  className?: string;
}

/**
 * This component is the component for the input, that's it.
 * * Not to be confused for OnboardHandleInput (renamed from HandleInput)
 * @returns an input that has an associated handler
 */
export const HandleInput = <T extends FieldValues>({
  name,
  register,
  setValue,
  error,
  className,
  ...props
}: HandleInputProps<T>) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <Input
        {...register(name)}
        type='text'
        // TODO: Keep the @ when user types
        placeholder='my-sorbet-handle'
        onChange={(e) => handleChange(e)}
        {...props}
        className={cn(
          'text-textPlaceholder focus:outline-none focus:ring-0',
          className
        )}
      />
      {error ? (
        <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
      ) : (
        <CircleCheck className='absolute right-4 top-3 h-4 w-4 text-[#00A886]' />
      )}
    </>
  );
};
