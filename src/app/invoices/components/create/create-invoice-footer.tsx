import { cn } from '@/lib/utils';

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
