import { CircleAlert, CircleCheck } from 'lucide-react';
import { ChangeEvent, ComponentProps } from 'react';
import {
  ControllerRenderProps,
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
 * This component is the component for the user handle input, that's it.
 * * Not to be confused for OnboardHandleInput (renamed from HandleInput)
 * @returns an input for user handles that is intended to be used with React Hook Form
 */
export const HandleInput = <T extends FieldValues>({
  name,
  register,
  setValue,
  error,
  className,
  ...props
}: HandleInputProps<T>) => {

  // This change handler allows us to mask the input to only allow valid handles to be typed or pasted
  // We still have zod validate the form, but this creates a better user experience by guiding
  // the user to a valid handle rather than erroring out when they "do something wrong"
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedHandle = e.target.value
      .replace(/[^a-zA-Z0-9 _-]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercase

    setValue(name, maskedHandle as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className='relative'>
      <Input
        {...register(name)}
        type='text'
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
    </div>
  );
};
