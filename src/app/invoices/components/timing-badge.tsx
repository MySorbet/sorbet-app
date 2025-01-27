import { cn } from '@/lib/utils';

/** Simple badge for displaying info about the timing of an invoice payment */
export const TimingBadge = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'w-fit rounded-md border border-[#B9E6FE] bg-[#F0F9FF] px-1.5 py-1 text-xs text-[#026AA2]',
        className
      )}
    >
      {children}
    </div>
  );
};
