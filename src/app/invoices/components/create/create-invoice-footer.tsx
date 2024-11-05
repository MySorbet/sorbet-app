import { cn } from '@/lib/utils';

/**
 * A footer component for the invoice creation form
 *
 * Renders children in a justify-between row with the appropriate separator on top
 */
export const CreateInvoiceFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'mt-4 flex w-full justify-between border-t border-gray-200 py-4',
        className
      )}
    >
      {children}
    </div>
  );
};
