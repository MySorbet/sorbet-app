import { FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';

/**
 * A shadcn `<FormItem/>` which renders children as a long row rather than a column.
 *
 * Render the same children you would for a shadcn `<FormItem/>` except for the `<FormLabel/>`. Instead, use the `label` prop.
 */
export const LongFormItem = ({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
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
