import { FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';

/**
 * A shadcn `<FormItem/>` which renders as a width filling row rather than a column.
 *
 * Render the same children you would for a shadcn `<FormItem/>` except for the `<FormLabel/>`.
 * Instead, use the `label` prop.
 *
 * @example
 * <LongFormItem label='My label'>
 *   <FormControl>
 *     <Input {...field} />
 *   </FormControl>
 *   <FormMessage />
 * </LongFormItem>
 */
export const LongFormItem = ({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  /** The label for the form item. Use this instead of `<FormLabel/>`. */
  label: string;
}) => {
  return (
    <FormItem
      className={cn('flex w-full justify-between gap-2 space-y-0', className)}
    >
      <FormLabel>{label}</FormLabel>
      <div className='max-w-md grow space-y-2'>{children}</div>
    </FormItem>
  );
};
